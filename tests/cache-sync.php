<?php
/** WordPress integration, with in-memory storage, controlled time and mocked HTTP/Rocket. */
namespace LN\EvangelischeTermineAusgeben {
    if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }
    function time() { return $GLOBALS['eta_now'] ?? \time(); }
    function get_option($key, $default = false) { return $GLOBALS['eta_options'][$key] ?? $default; }
    function update_option($key, $value, $autoload = null) { $GLOBALS['eta_options'][$key] = $value; return true; }
    function add_option($key, $value, $unused = '', $autoload = null) {
        if (isset($GLOBALS['eta_options'][$key])) { return false; }
        return update_option($key, $value);
    }
    function delete_option($key) { unset($GLOBALS['eta_options'][$key]); return true; }
    function function_exists($name) {
        return $name === 'rocket_clean_files' ? ($GLOBALS['eta_rocket_available'] ?? true) : \function_exists($name);
    }
    function wp_next_scheduled($hook) { return $GLOBALS['eta_cron'][$hook] ?? false; }
    function wp_clear_scheduled_hook($hook) { unset($GLOBALS['eta_cron'][$hook]); return 1; }
    function wp_schedule_event($time, $recurrence, $hook) {
        if (!isset(apply_filters('cron_schedules', [])[$recurrence])) { throw new \RuntimeException('Unregistered interval'); }
        $GLOBALS['eta_cron'][$hook] = $time;
        return true;
    }
    function get_transient($key) {
        return ($GLOBALS['eta_ttl'][$key] ?? 0) > time() ? ($GLOBALS['eta_cache'][$key] ?? false) : false;
    }
    function set_transient($key, $value, $ttl) {
        $GLOBALS['eta_cache'][$key] = $value;
        $GLOBALS['eta_ttl'][$key] = time() + $ttl;
        return true;
    }
    function get_post_meta($id, $key, $single = false) { return $GLOBALS['eta_meta'][$id][$key] ?? ''; }
    function update_post_meta($id, $key, $value, $previous = '') {
        if ($previous && get_post_meta($id, $key, true) !== $previous) { return false; }
        $GLOBALS['eta_meta'][$id][$key] = wp_unslash($value);
        return true;
    }
    function delete_post_meta($id, $key, $previous = '') { unset($GLOBALS['eta_meta'][$id][$key]); return true; }
    function get_posts($args) {
        $ids = array_keys($GLOBALS['eta_meta'] ?? []);
        sort($ids);
        $ids = array_filter($ids, static fn ($id) => !empty($GLOBALS['eta_meta'][$id][CacheSync::META]));
        return array_map(static fn ($id) => $GLOBALS['eta_posts'][$id], array_slice(array_values($ids), ($args['paged'] - 1) * 50, 50));
    }
    function get_permalink($post) {
        $id = is_object($post) ? $post->ID : $post;
        return $id === 1 ? home_url('/') : home_url('/fixture-' . $id . '/');
    }
    function is_admin() { return $GLOBALS['eta_admin'] ?? false; }
    function is_user_logged_in() { return $GLOBALS['eta_logged_in'] ?? false; }
    function is_singular() { return $GLOBALS['eta_singular'] ?? true; }
    function is_preview() { return $GLOBALS['eta_preview'] ?? false; }
    function is_feed() { return false; }
    function get_query_var($key) { return 0; }
    function get_queried_object() { return $GLOBALS['eta_current_post']; }
    function get_block_wrapper_attributes($attrs = []) {
        return 'class="' . esc_attr($GLOBALS['eta_wrapper'] ?? '') . ' ' . esc_attr($attrs['class'] ?? '') . '"';
    }
}

namespace {
    function rocket_clean_files($urls) { $GLOBALS['eta_purges'][] = $urls; }
    require $argv[1] ?? dirname(__DIR__, 4) . '/wp-load.php';
    use LN\EvangelischeTermineAusgeben\CacheSync;
    use LN\EvangelischeTermineAusgeben\DataFetcher;
    use LN\EvangelischeTermineAusgeben\BlockRender;

    function verifyCache($ok, $label) {
        if (!$ok) { throw new \RuntimeException($label); }
        echo "PASS: $label\n";
    }
    $GLOBALS['eta_now'] = time();
    $GLOBALS['eta_options'] = [];
    $GLOBALS['eta_purges'] = [];
    $GLOBALS['eta_meta'] = [];
    $calls = [];
    $feed = [
        ['Veranstaltung' => ['ID' => '101', '_event_TITLE' => 'Kids-Treff', 'DATUM' => 'Sonntag, 20. Oktober', 'START_RFC' => '2099-10-20T10:00:00+02:00', 'START_UHRZEIT' => '10.00']],
        ['Veranstaltung' => ['ID' => '102', '_event_TITLE' => 'Kinderkino', 'DATUM' => 'Samstag, 26. Oktober', 'START_RFC' => '2099-10-26T14:00:00+02:00']],
    ];
    $bad = null;
    add_filter('pre_http_request', static function ($pre, $args, $url) use (&$calls, &$feed, &$bad) {
        verifyCache(wp_parse_url($url, PHP_URL_HOST) === 'www.evangelische-termine.de', 'Only fixed event provider requested');
        $calls[] = [$url, $args];
        if ($bad instanceof WP_Error) { return $bad; }
        return ['headers' => [], 'response' => ['code' => 200], 'body' => $bad ?? wp_json_encode($feed)];
    }, 10, 3);
    $visit = static function (int $id, array $attrs) {
        $GLOBALS['eta_current_post'] = $GLOBALS['eta_posts'][$id] = new WP_Post((object) [
            'ID' => $id, 'post_status' => 'publish', 'post_type' => 'page', 'post_password' => '',
        ]);
        CacheSync::begin_page();
        $html = (new BlockRender())->render_block_blueprint($attrs);
        CacheSync::finish_page();
        return $html;
    };
    $_GET = [];
    $kids = ['id' => '1081, 562', 'searchText' => 'Kids', 'searchTitleOnly' => true, 'limit' => 1];
    $cinema = ['id' => '1081,562', 'searchText' => 'Kinderkino', 'searchTitleOnly' => true, 'limit' => 1];
    $visit(1, $kids);
    verifyCache(!$GLOBALS['eta_meta'], 'Disabled integration does not register pages');
    $GLOBALS['eta_options'][CacheSync::OPTION] = true;
    foreach (['eta_logged_in', 'eta_admin', 'eta_preview'] as $flag) {
        $GLOBALS[$flag] = true;
        $visit(1, $kids);
        verifyCache(!$GLOBALS['eta_meta'], 'No dependency recording for ' . $flag);
        $GLOBALS[$flag] = false;
    }
    $_GET = ['kirchentermin' => '101'];
    $visit(1, $kids);
    verifyCache(!$GLOBALS['eta_meta'], 'Detail/query-string requests do not overwrite canonical page dependencies');
    $_GET = ['bad' => ['nested']];
    $visit(1, $kids);
    verifyCache(!$GLOBALS['eta_meta'], 'Array query parameters safely ignored');
    $_GET = [];
    $GLOBALS['eta_wrapper'] = 'real-gutenberg-wrapper';
    $visit(1, $kids);
    $visit(2, $cinema);
    $visit(3, $kids + ['legacy' => true]);
    verifyCache(count($GLOBALS['eta_meta']) === 3, 'Rendering registers homepage, filtered and legacy consumers automatically');
    $before = count($calls);
    $GLOBALS['eta_wrapper'] = 'different-cron-context';
    CacheSync::run();
    verifyCache(count($calls) === $before + 1 && !$GLOBALS['eta_purges'], 'Shared multi-organizer feed fetched once; unchanged output and wrapper context do not purge');
    $args = end($calls)[1];
    verifyCache($args['timeout'] === 5 && $args['redirection'] === 0 && $args['limit_response_size'] === 2 * MB_IN_BYTES, 'Background request is bounded');
    $query = ['vid' => '1081,562'];
    $key = DataFetcher::event_cache_key($query);
    $feed[0]['Veranstaltung']['_event_TITLE'] = 'Kids-Treff am See';
    CacheSync::run(true);
    verifyCache(count($GLOBALS['eta_purges']) === 2 && str_starts_with($GLOBALS['eta_purges'][0], home_url('/index'))
        && str_contains($GLOBALS['eta_purges'][1], 'fixture-3/index'), 'Kids change purges homepage and legacy page, never the cinema page');
    verifyCache($GLOBALS['eta_cache'][$key] === $feed, 'Fresh feed is committed before page cache invalidation');
    $GLOBALS['eta_purges'] = [];
    $feed[0]['Veranstaltung']['_event_MODIFIED'] = '18.10.2026 12:34';
    $feed[0]['Veranstaltung']['_event_LONG_DESCRIPTION'] = 'Not displayed in this title-only block';
    CacheSync::run(true);
    verifyCache(!$GLOBALS['eta_purges'], 'Invisible metadata and description changes leave these list pages cached');

    $last_good = $GLOBALS['eta_cache'][$key];
    foreach ([new WP_Error('offline', 'timeout'), '{"error":"busy"}', 'null', '[{"Veranstaltung":', '[{"Veranstaltung":{"ID":[123]}}]'] as $bad) {
        CacheSync::run(true);
        verifyCache(!$GLOBALS['eta_purges'] && $GLOBALS['eta_cache'][$key] === $last_good, 'Failed or malformed response preserves valid feed and page cache');
    }
    $before = count($calls);
    CacheSync::run();
    verifyCache(count($calls) === $before, 'Failure backoff prevents immediate retries');
    $bad = null;
    CacheSync::run(true);
    verifyCache(!$GLOBALS['eta_purges'], 'Recovery with unchanged data does not purge');
    $GLOBALS['eta_cache'][$key] = ['error' => 'An invalid response from a regular REST cache miss'];
    CacheSync::run();
    verifyCache(!$GLOBALS['eta_purges'] && $GLOBALS['eta_cache'][$key] === $feed, 'Unvalidated data from other cache writers is refreshed before comparison');
    $feed = [];
    CacheSync::run(true);
    verifyCache(count($GLOBALS['eta_purges']) === 3 && $GLOBALS['eta_cache'][$key] === [], 'Valid empty calendar removes events from affected pages');
    $GLOBALS['eta_purges'] = [];

    $GLOBALS['eta_options'][CacheSync::LOCK] = $GLOBALS['eta_now'] + 120;
    $before = count($calls);
    CacheSync::run(true);
    verifyCache(count($calls) === $before, 'Parallel workers cannot refresh the same feeds');
    unset($GLOBALS['eta_options'][CacheSync::LOCK]);

    // A subsequent complete public render with no lists removes the dependency.
    $GLOBALS['eta_current_post'] = $GLOBALS['eta_posts'][2];
    CacheSync::begin_page();
    CacheSync::finish_page();
    verifyCache(empty($GLOBALS['eta_meta'][2][CacheSync::META]), 'Removing all lists removes their stored page dependency');

    // Theme comparison uses its real normalizer and visible fields, including time passing.
    if (class_exists(\App\Church\Events::class)) {
        $rows = [['Veranstaltung' => ['ID' => '500', '_event_TITLE' => 'Kids-Treff', 'START_RFC' => date(DATE_ATOM, time() - 1)]]];
        $earlier = \App\Church\Events::normalize($rows, new DateTimeImmutable('-2 minutes'));
        foreach ($earlier as &$event) { $event['href'] = \App\Church\Events::url($event['id']); }
        unset($event);
        $method = new ReflectionMethod(\App\Church\Events::class, 'cacheValue');
        $value = $method->invoke(null, $earlier);
        $GLOBALS['eta_current_post'] = $GLOBALS['eta_posts'][4] = new WP_Post((object) ['ID' => 4, 'post_status' => 'publish', 'post_type' => 'page', 'post_password' => '']);
        CacheSync::begin_page();
        CacheSync::observe('achillea/events', ['vid' => '1081', 'itemsPerPage' => 100], ['limit' => 3, 'topic' => 'kids', 'search' => ''], $value);
        CacheSync::finish_page();
        $feed = $rows;
        CacheSync::run(true);
        verifyCache(count(array_filter($GLOBALS['eta_purges'], static fn ($url) => str_contains($url, 'fixture-4/index'))) === 1, 'Theme page expires a past event even if the provider row is unchanged');
        $consumer = reset($GLOBALS['eta_meta'][4][CacheSync::META]['consumers']);
        $rows[0]['Veranstaltung']['START_RFC'] = '2099-10-20T10:00:00+02:00';
        $baseline = CacheSync::project($consumer, $rows);
        $rows[0]['Veranstaltung']['_event_LONG_DESCRIPTION'] = 'A hidden detail change';
        verifyCache(CacheSync::project($consumer, $rows) === $baseline, 'Theme fingerprint ignores fields not shown in event cards');
    }
    // Save a fresh baseline, clear only the transient and verify persistent comparison.
    $GLOBALS['eta_purges'] = [];
    CacheSync::run(true);
    $GLOBALS['eta_purges'] = [];
    $GLOBALS['eta_cache'] = [];
    $GLOBALS['eta_now'] += HOUR_IN_SECONDS;
    CacheSync::run();
    verifyCache(!$GLOBALS['eta_purges'], 'Comparison survives transient expiry without unnecessary purges');
    verifyCache(is_wp_error(DataFetcher::refresh_events(['url' => 'https://example.invalid/'])), 'Refresh rejects arbitrary endpoint parameters');

    // Automatic scheduling is opt-in and removed again when disabled.
    $GLOBALS['eta_options'][CacheSync::OPTION] = true;
    CacheSync::schedule();
    verifyCache((bool) \LN\EvangelischeTermineAusgeben\wp_next_scheduled(CacheSync::HOOK), 'Enabled integration schedules periodic checks');
    $GLOBALS['eta_options'][CacheSync::OPTION] = false;
    CacheSync::schedule();
    verifyCache(!\LN\EvangelischeTermineAusgeben\wp_next_scheduled(CacheSync::HOOK), 'Disabling removes scheduled checks');
    $GLOBALS['eta_options'][CacheSync::OPTION] = true;
    $GLOBALS['eta_rocket_available'] = false;
    $before = count($calls);
    CacheSync::run(true);
    verifyCache(count($calls) === $before && !CacheSync::enabled(), 'WP Rocket absence pauses background work without changing the saved preference');
    $GLOBALS['eta_rocket_available'] = true;
    $GLOBALS['eta_meta'] = [];
    unset($GLOBALS['eta_options'][CacheSync::STATE]);
    for ($id = 10; $id < 17; ++$id) { $visit($id, ['id' => (string) $id, 'limit' => 1]); }
    $before = count($calls);
    CacheSync::run();
    verifyCache(count($calls) === $before + 3, 'A background tick makes at most three upstream requests');
    $before = count($calls);
    CacheSync::run();
    verifyCache(count($calls) === $before + 3, 'Following ticks prioritize previously unchecked feeds');
    $before = count($calls);
    CacheSync::run();
    verifyCache(count($calls) === $before + 1, 'The remaining feed is checked without refreshing the six fresh feeds again');
    echo "PASS: cache integration checks complete\n";
}
