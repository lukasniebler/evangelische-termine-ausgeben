<?php
/** Integration test with a mocked REST feed; no external requests or database writes. */
require $argv[1] ?? dirname(__DIR__, 4).'/wp-load.php';

$fixture = [
    ['Veranstaltung' => ['ID' => '1', '_event_TITLE' => 'Kinderkino', '_event_LONG_DESCRIPTION' => 'Euer Kids-Treff Team']],
    ['Veranstaltung' => ['ID' => '2', '_event_TITLE' => 'Kids-Treff im Oktober']],
    ['Veranstaltung' => ['ID' => '3', '_event_TITLE' => 'Kids-Treff im November']],
];
$intercept = static function ($result, $server, $request) use ($fixture) {
    if ($request->get_route() === '/evangelische-termine-ausgeben/v1/data') {
        return new WP_REST_Response($fixture);
    }
    return $result;
};
add_filter('rest_pre_dispatch', $intercept, 10, 3);
try {
    $renderer = new LN\EvangelischeTermineAusgeben\BlockRender();
    foreach ([false, true] as $legacy) {
        $render = static fn (array $args): string => $renderer->render_block_blueprint($args + ['legacy' => $legacy, 'heading' => '', 'limit' => 10]);
        $default = $render(['searchText' => 'Kids']);
        if (!str_contains($default, 'Kinderkino') || !str_contains($default, 'Kids-Treff im Oktober')) {
            throw new RuntimeException('The default search must still include descriptions.');
        }
        $titleOnly = $render(['searchText' => '  KIDS  ', 'searchTitleOnly' => true, 'limit' => 1]);
        if (str_contains($titleOnly, 'Kinderkino') || !str_contains($titleOnly, 'Kids-Treff im Oktober') || str_contains($titleOnly, 'Kids-Treff im November')) {
            throw new RuntimeException('Title-only matching or limiting after filtering failed.');
        }
        if (!str_contains($render(['searchText' => 'Nicht vorhanden', 'searchTitleOnly' => true]), 'Keine Veranstaltungen gefunden.')) {
            throw new RuntimeException('The empty-state message is missing.');
        }
        if (!str_contains($render(['searchText' => '', 'searchTitleOnly' => true]), 'Kinderkino')) {
            throw new RuntimeException('An empty search must not filter results.');
        }
    }
} finally {
    remove_filter('rest_pre_dispatch', $intercept, 10);
}
echo "PASS: modern and legacy search, title-only matching, case/whitespace, limit after filtering, empty results and backward compatibility\n";
