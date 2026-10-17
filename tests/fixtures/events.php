<?php
/** Controlled feed for output-compatibility and organizer tests. */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit;
}

return [
    ['Veranstaltung' => [
        'ID' => '1001', '_event_ID' => 'old-1001', '_event_TITLE' => 'Gottesdienst & Musik <Gemeinde>',
        'START_RFC' => '2026-11-01T10:00:00+01:00', 'DATUM' => 'Sonntag, 1.11.2026 10.00-11.00 Uhr',
        'START_UHRZEIT' => '10.00', 'END_UHRZEIT' => '11.00',
        'WOCHENTAG_START_LANG' => 'Sonntag', 'WOCHENTAG_START_KURZ' => 'So',
        'LITURG_BEZ' => '21. Sonntag nach Trinitatis', '_person_NAME' => 'Pfarrerin Beispiel & Team',
        '_place_NAME' => 'Kirche', '_place_CITY' => 'Neuhaus', '_place_STREET_NR' => 'Kirchplatz 1',
        '_place_ZIP' => '91325', '_place_KAT' => 'Kirche',
        '_event_SHORT_DESCRIPTION' => 'Musik für alle', '_event_LONG_DESCRIPTION' => 'Herzliche Einladung.',
    ]],
    ['Veranstaltung' => [
        'ID' => '1002', '_event_TITLE' => 'Seniorenkreis',
        'START_RFC' => '2026-11-02T14:30:00+01:00', 'DATUM' => 'Montag, 2.11.2026',
        'START_UHRZEIT' => '14.30', '_place_NAME' => 'Gemeindehaus', '_place_CITY' => 'Erlangen',
    ]],
    ['Veranstaltung' => [
        'ID' => '', '_event_ID' => '1003', '_event_TITLE' => 'Offener Treff',
        'START_RFC' => '2026-11-03T16:00:00+01:00', 'DATUM' => 'Dienstag, 3.11.2026',
        'START_UHRZEIT' => '16.00',
    ]],
];
