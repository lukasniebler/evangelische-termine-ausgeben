<?php
/** Optional XML feed, mocked transport and storage. No database writes or remote requests. */
namespace LN\EvangelischeTermineAusgeben {
    if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }
    function get_transient($key) { return $GLOBALS['eta_details_cache'][$key] ?? false; }
    function set_transient($key, $value, $ttl) { $GLOBALS['eta_details_cache'][$key] = $value; $GLOBALS['eta_details_ttl'][$key] = $ttl; return true; }
    function get_option($key, $default = false) { return $GLOBALS['eta_details_options'][$key] ?? $default; }
    function add_option($key, $value, $deprecated = '', $autoload = null) {
        if (isset($GLOBALS['eta_details_options'][$key])) { return false; }
        $GLOBALS['eta_details_options'][$key] = $value;
        return true;
    }
    function delete_option($key) { unset($GLOBALS['eta_details_options'][$key]); return true; }
}
namespace {
    require $argv[1] ?? dirname(__DIR__, 4).'/wp-load.php';
    use LN\EvangelischeTermineAusgeben\EventDetails;
    function verifyDetails($ok, $label) { if (!$ok) { throw new RuntimeException($label); } echo "PASS: $label\n"; }
    $xml = '<root><Export><meta/><Veranstaltung><ID>123</ID><_event_TITLE Label="Titel">Kino &amp; Musik</_event_TITLE><_event_TEXTLINE_1 Label="Kosten">5 Euro</_event_TEXTLINE_1><_inputmask_FIELDS><_event_TITLE/><_event_TEXTLINE_1/></_inputmask_FIELDS></Veranstaltung></Export></root>';
    $rows = EventDetails::parse($xml);
    verifyDetails($rows[0]['Veranstaltung']['_event_TITLE'] === 'Kino & Musik', 'Actual XML hierarchy and decoded text');
    verifyDetails($rows[0]['Veranstaltung']['_field_labels']['_event_TEXTLINE_1'] === 'Kosten' && $rows[0]['Veranstaltung']['_visible_fields'] === ['_event_TITLE', '_event_TEXTLINE_1'], 'Labels and form field selection survive conversion');
    verifyDetails(EventDetails::parse('<root><Export><meta/></Export></root>') === [], 'Empty export is a valid empty feed');
    foreach (['<html/>', '<root>', '<!DOCTYPE root [<!ENTITY x SYSTEM "file:///etc/passwd">]><root><Export/></root>'] as $bad) {
        verifyDetails(is_wp_error(EventDetails::parse($bad)), 'Malformed, unexpected or entity-bearing XML rejected');
    }
    $calls = [];
    $fail = false;
    add_filter('pre_http_request', static function ($pre, $args, $url) use (&$calls, &$fail, $xml) {
        $calls[] = [$url, $args];
        return $fail ? new WP_Error('fixture', 'offline') : ['headers'=>[], 'body'=>$xml, 'response'=>['code'=>200]];
    }, 10, 3);
    $first = EventDetails::get(1081);
    verifyDetails($first === $rows && EventDetails::get(1081) === $first && count($calls) === 1, 'One upstream request per cached organizer');
    verifyDetails($calls[0][1]['timeout'] === 5 && $calls[0][1]['limit_response_size'] === 2 * MB_IN_BYTES, 'Bounded request duration and response size');
    verifyDetails($GLOBALS['eta_details_ttl']['ln_eta_details_v1_1081'] === HOUR_IN_SECONDS && !$GLOBALS['eta_details_options'], 'Successful cache lasts one hour and lock is released');
    verifyDetails(is_wp_error(EventDetails::get(0)) && count($calls) === 1, 'Invalid organizer never reaches provider');
    $fail = true;
    verifyDetails(is_wp_error(EventDetails::get(562)) && is_wp_error(EventDetails::get(562)) && count($calls) === 2, 'Failure backoff prevents repeated blocking requests');
    verifyDetails($GLOBALS['eta_details_ttl']['ln_eta_details_v1_562_retry'] === MINUTE_IN_SECONDS && !$GLOBALS['eta_details_options'], 'Failure backoff expires and lock is released');
    $GLOBALS['eta_details_options']['ln_eta_details_v1_99_lock'] = time() + 15;
    verifyDetails(is_wp_error(EventDetails::get(99)) && count($calls) === 2, 'Concurrent visitor does not start another upstream request');
    $GLOBALS['eta_details_options']['ln_eta_details_v1_99_lock'] = time() - 1;
    $fail = false;
    verifyDetails(EventDetails::get(99) === $rows && count($calls) === 3, 'Expired request lock recovers');
}
