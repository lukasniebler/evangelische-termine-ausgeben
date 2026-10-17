<?php
/** WordPress integration with intercepted HTTP and an in-memory plugin cache. No DB writes. */
namespace LN\EvangelischeTermineAusgeben {
    function get_transient($key) { return $GLOBALS['eta_test_cache'][$key] ?? false; }
    function set_transient($key, $value, $expiration) {
        $GLOBALS['eta_test_cache'][$key] = $value;
        $GLOBALS['eta_test_lifetimes'][$key] = $expiration;
        return true;
    }
}

namespace {
    require $argv[1] ?? dirname(__DIR__, 4).'/wp-load.php';

    function checkOrganizers(bool $ok, string $label): void {
        if (!$ok) { throw new RuntimeException($label); }
        echo 'PASS: '.$label.PHP_EOL;
    }

    $fixture = require __DIR__.'/fixtures/events.php';
    $renderer = new LN\EvangelischeTermineAusgeben\BlockRender();
    $baselineFeed = static function ($result, $server, $request) use ($fixture) {
        return $request->get_route() === '/evangelische-termine-ausgeben/v1/data'
            ? new WP_REST_Response($fixture) : $result;
    };
    add_filter('rest_pre_dispatch', $baselineFeed, 10, 3);
    try {
        // Captured before this change, from b2fb7dd. Includes both weekday formats,
        // heading/no heading, escaping, alternating rows, locations and fallback IDs.
        $snapshots = json_decode(file_get_contents(__DIR__.'/fixtures/output-before-multi-organizers.json'), true, 512, JSON_THROW_ON_ERROR);
        foreach ($snapshots as $case) {
            checkOrganizers($renderer->render_block_blueprint($case['attributes']) === $case['html'],
                ($case['attributes']['legacy'] ? 'Legacy' : 'Modern').' HTML unchanged; short weekdays '.($case['attributes']['shortWeekdays'] ? 'on' : 'off'));
        }
    } finally {
        remove_filter('rest_pre_dispatch', $baselineFeed, 10);
    }

    $GLOBALS['eta_test_cache'] = [];
    $GLOBALS['eta_test_lifetimes'] = [];
    $requests = [];
    $failHttp = false;
    $http = static function ($result, $args, $url) use (&$requests, &$failHttp, $fixture) {
        if (parse_url($url, PHP_URL_HOST) !== 'www.evangelische-termine.de') {
            throw new RuntimeException('Unexpected external request in organizer test.');
        }
        parse_str(parse_url($url, PHP_URL_QUERY) ?? '', $params);
        $requests[] = $params;
        if ($failHttp) { return new WP_Error('test_failure', 'Controlled upstream failure'); }
        if (parse_url($url, PHP_URL_PATH) !== '/json') {
            $data = [['id' => 1, 'name' => 'Kirche']];
        } else {
            // Emulate the provider's single, chronological feed for both organizers.
            $data = [];
            foreach (explode(',', $params['vid'] ?? '1081') as $id) {
                foreach ($id === '562' ? [$fixture[1]] : [$fixture[0], $fixture[2]] as $event) {
                    $v = $event['Veranstaltung'];
                    $data[$v['ID'] ?: $v['_event_ID']] = $event;
                }
            }
            $data = array_values($data);
            usort($data, static fn ($a, $b) => strcmp($a['Veranstaltung']['START_RFC'], $b['Veranstaltung']['START_RFC']));
            if (isset($params['itemsPerPage'])) { $data = array_slice($data, 0, (int) $params['itemsPerPage']); }
        }
        return ['headers' => [], 'body' => wp_json_encode($data), 'response' => ['code' => 200, 'message' => 'OK']];
    };
    $request = static function (array $params) {
        $request = new WP_REST_Request('GET', '/evangelische-termine-ausgeben/v1/data');
        $request->set_query_params($params + ['endpoint' => 'events']);
        return rest_do_request($request);
    };
    add_filter('pre_http_request', $http, 10, 3);
    try {
        $single = $request(['vid' => '1081', 'itemsPerPage' => 2]);
        checkOrganizers($single->get_status() === 200 && $requests === [['itemsPerPage' => '2', 'vid' => '1081']], 'Single-ID query parameters are unchanged');
        $oldCacheKey = 'ln_eta_data_'.md5('events'.http_build_query(['itemsPerPage' => 2, 'vid' => '1081']));
        checkOrganizers(isset($GLOBALS['eta_test_cache'][$oldCacheKey]) && $GLOBALS['eta_test_lifetimes'][$oldCacheKey] === HOUR_IN_SECONDS, 'Existing single-ID cache key and lifetime are preserved');

        $combined = $request(['vid' => ' 1081, 562,1081, ,', 'itemsPerPage' => 2, 'eventtype' => '-1', 'people' => '30']);
        $combinedEvents = $combined->get_data();
        checkOrganizers($combined->get_status() === 200 && end($requests) === ['eventtype' => '-1', 'itemsPerPage' => '2', 'people' => '30', 'vid' => '1081,562'], 'One combined request normalizes spaces, duplicates and empty entries while preserving filters');
        checkOrganizers(array_column(array_column($combinedEvents, 'Veranstaltung'), 'ID') === ['1001', '1002'], 'Combined chronological feed and total limit reach REST clients unchanged');
        $count = count($requests);
        $cached = $request(['vid' => '1081,562', 'itemsPerPage' => 2, 'eventtype' => '-1', 'people' => '30']);
        checkOrganizers(count($requests) === $count && $cached->get_data() === $combinedEvents, 'Equivalent organizer lists reuse the combined cache');
        $request(['vid' => '001081,1081,', 'itemsPerPage' => 2]);
        checkOrganizers(count($requests) === $count, 'Duplicate IDs collapsing to one organizer reuse its existing cache');

        foreach ([false, true] as $legacy) {
            $html = $renderer->render_block_blueprint(['id' => '1081, 562', 'limit' => 2, 'legacy' => $legacy]);
            checkOrganizers(str_contains($html, 'Gottesdienst &amp; Musik') && str_contains($html, 'Seniorenkreis') && strpos($html, 'Gottesdienst &amp; Musik') < strpos($html, 'Seniorenkreis') && !str_contains($html, 'Offener Treff'), ($legacy ? 'Legacy' : 'Modern').' output contains both organizers with one total limit');
            $filtered = $renderer->render_block_blueprint(['id' => '1081,562', 'limit' => 1, 'legacy' => $legacy, 'searchText' => 'Senioren', 'searchTitleOnly' => true]);
            checkOrganizers(str_contains($filtered, 'Seniorenkreis') && !str_contains($filtered, 'Gottesdienst &amp; Musik'), 'Local filtering precedes the combined limit in '.($legacy ? 'legacy' : 'modern').' mode');
        }

        $count = count($requests);
        foreach (['1081,abc', '1081,0', '1081,-562', ', ,', '1081,56.2'] as $invalid) {
            $response = $request(['vid' => $invalid]);
            checkOrganizers($response->get_status() === 400 && $response->get_data()['code'] === 'ln_eta_invalid_organizer_ids', 'Invalid list rejected: '.$invalid);
        }
        foreach ([false, true] as $legacy) {
            $error = $renderer->render_block_blueprint(['id' => '1081,abc', 'legacy' => $legacy]);
            checkOrganizers(str_contains($error, 'ln-eta-error') && str_contains($error, 'positive Zahlen') && !str_contains($error, 'et_content_row'), 'Validation message reaches '.($legacy ? 'legacy' : 'modern').' output');
        }
        checkOrganizers(count($requests) === $count, 'Invalid lists never fetch an unfiltered or partial feed');

        $request(['endpoint' => 'placetype', 'vid' => 'A,B']);
        checkOrganizers(end($requests)['vid'] === 'A,B', 'Other REST endpoints retain their existing parameter handling');
        $request(['region' => '404']);
        checkOrganizers(!isset(end($requests)['vid']), 'Existing requests without a vid remain supported');

        $GLOBALS['eta_test_cache'] = [];
        $failHttp = true;
        foreach ([false, true] as $legacy) {
            $error = $renderer->render_block_blueprint(['id' => '1081,562', 'legacy' => $legacy]);
            checkOrganizers(str_contains($error, 'ln-eta-error') && !str_contains($error, 'Seniorenkreis'), 'Upstream failures show an error instead of incomplete '.($legacy ? 'legacy' : 'modern').' results');
        }
        checkOrganizers($GLOBALS['eta_test_cache'] === [], 'Failed requests are not cached');

        $saved = '<!-- wp:evangelische-termine-ausgeben/evangelische-termine {"id":"1081, 562","legacy":true,"limit":2} /-->';
        $blocks = parse_blocks($saved);
        checkOrganizers(serialize_blocks($blocks) === $saved && $blocks[0]['attrs']['legacy'] === true, 'Existing block schema stores comma-separated IDs without migration or changing legacy mode');
    } finally {
        remove_filter('pre_http_request', $http, 10);
    }
}
