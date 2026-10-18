<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

use WP_Error;

/** Optional labelled feed for custom detail templates. Existing blocks never call this. */
final class EventDetails
{
    public static function get(int $organizer)
    {
        if ($organizer < 1) {
            return self::unavailable();
        }
        $key = 'ln_eta_details_v1_'.$organizer;
        $cached = get_transient($key);
        if (is_array($cached)) {
            return $cached;
        }
        if (get_transient($key.'_retry') !== false) {
            return self::unavailable();
        }

        // Atomic option lock also works on hosts without a persistent object cache.
        $lock = $key.'_lock';
        $expires = get_option($lock, 0);
        if ($expires && (int) $expires < time()) {
            delete_option($lock);
        }
        if (!add_option($lock, time() + 15, '', false)) {
            return self::unavailable();
        }
        try {
            $response = wp_remote_get(add_query_arg([
                'vid' => $organizer, 'itemsPerPage' => 100,
            ], 'https://www.evangelische-termine.de/Veranstalter/xml.php'), [
                'timeout' => 5, 'redirection' => 2, 'limit_response_size' => 2 * MB_IN_BYTES,
            ]);
            $data = is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200
                ? self::unavailable() : self::parse(wp_remote_retrieve_body($response));
            if (is_wp_error($data)) {
                // A provider outage must not cause a new blocking request for each visitor.
                set_transient($key.'_retry', 1, MINUTE_IN_SECONDS);
                return $data;
            }
            set_transient($key, $data, HOUR_IN_SECONDS);
            return $data;
        } finally {
            delete_option($lock);
        }
    }

    /** Preserve field labels and the public form's field selection, never XML markup. */
    public static function parse(string $body)
    {
        if (!function_exists('simplexml_load_string') || stripos($body, '<!DOCTYPE') !== false) {
            return self::unavailable();
        }
        $previous = libxml_use_internal_errors(true);
        try {
            $xml = simplexml_load_string($body, 'SimpleXMLElement', LIBXML_NONET | LIBXML_NOCDATA);
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }
        if ($xml === false || $xml->getName() !== 'root' || !isset($xml->Export)) {
            return self::unavailable();
        }
        $rows = [];
        foreach ($xml->Export->Veranstaltung as $node) {
            $event = [];
            $labels = [];
            $visible = [];
            foreach ($node->children() as $name => $value) {
                if ($name === '_inputmask_FIELDS') {
                    foreach ($value->children() as $field => $unused) {
                        $visible[] = $field;
                    }
                    continue;
                }
                $event[$name] = (string) $value;
                if (isset($value['Label'])) {
                    $labels[$name] = (string) $value['Label'];
                }
            }
            $event['_field_labels'] = $labels;
            $event['_visible_fields'] = $visible;
            $rows[] = ['Veranstaltung' => $event];
        }
        return $rows;
    }

    private static function unavailable(): WP_Error
    {
        return new WP_Error('ln_eta_details_unavailable', __('Zusätzliche Terminangaben sind gerade nicht verfügbar.', 'evangelische-termine-ausgeben'));
    }
}
