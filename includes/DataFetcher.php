<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class DataFetcher
{
    const TRANSIENT_PREFIX = 'ln_eta_data_';
    const TRANSIENT_LIFETIME = HOUR_IN_SECONDS;
    // Basis-URLs können je nach Schnittstelle angepasst werden.
    // Diese Liste kann nach Bedarf erweitert werden.
    private $base_endpoints = [
        'dekanate_v1'    => 'http://www.evangelische-termine.de/dekanate',
        'dekanate_v2'    => 'http://www.evangelische-termine.de/service/subregions.json',
        'userofdekanat'  => 'http://www.evangelische-termine.de/userofdekanat',
        'channels'       => 'http://www.evangelische-termine.de/service/channels-1.json',
        'eventtypes'     => 'http://www.evangelische-termine.de/service/eventtypes.json',
        'people'         => 'http://www.evangelische-termine.de/service/people.json',
        'placetype'      => 'http://www.evangelische-termine.de/service/placetype.json',
        'kat'            => 'http://www.evangelische-termine.de/service/kat.json',
        'regions'        => 'http://www.evangelische-termine.de/service/regions.json',
        'events'         => 'https://www.evangelische-termine.de/json',
    ];

    public function __construct(bool $register_routes = true)
    {
        if ($register_routes) {
            add_action('rest_api_init', [$this, 'register_rest_routes']);
        }
    }

    /** Internal refresh only: public REST callers cannot bypass the cache. */
    public static function refresh_events(array $params)
    {
        $params = self::event_params($params);
        return is_wp_error($params) ? $params : (new self(false))->fetch_data('events', $params, true);
    }

    public static function event_params(array $params)
    {
        unset($params['endpoint']);
        foreach ($params as $key => $value) {
            if (!in_array($key, ['vid', 'itemsPerPage', 'eventtype', 'people', 'placetype'], true)
                || !is_scalar($value) || strlen((string) $value) > 200) {
                return new WP_Error('ln_eta_cache_query', __('Ungültige Terminabfrage.', 'evangelische-termine-ausgeben'));
            }
            $params[$key] = (string) $value;
        }
        if (isset($params['vid'])) {
            $params['vid'] = (new self(false))->normalize_organizer_ids($params['vid']);
            if (is_wp_error($params['vid'])) { return $params['vid']; }
        }
        ksort($params);
        return $params;
    }

    public static function event_cache_key(array $params): string
    {
        ksort($params);
        return self::TRANSIENT_PREFIX . md5('events' . http_build_query($params));
    }

    public static function valid_event_rows($data): bool
    {
        if (!is_array($data) || ($data && array_keys($data) !== range(0, count($data) - 1))) { return false; }
        foreach ($data as $row) {
            if (!is_array($row) || !is_array($row['Veranstaltung'] ?? null)
                || (empty($row['Veranstaltung']['ID']) && empty($row['Veranstaltung']['_event_ID']))) { return false; }
            foreach ($row['Veranstaltung'] as $field => $value) {
                if ($value !== null && !is_scalar($value)
                    && !in_array($field, ['_inputmask_FIELDS', '_field_labels', '_visible_fields'], true)) { return false; }
            }
        }
        return true;
    }

    public function register_rest_routes()
    {
        register_rest_route('evangelische-termine-ausgeben/v1', '/data', [
            'methods'             => 'GET',
            'callback'            => [$this, 'handle_get_data'],
            'permission_callback' => '__return_true',
            'args'                => $this->get_endpoint_args(),
        ]);
    }

    private function get_endpoint_args()
    {
        return [
            'endpoint' => [
                'required'          => true,
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => [$this, 'validate_endpoint'],
                'description'       => 'Einer der vordefinierten Endpoints wie "dekanate_v2", "events", etc.'
            ],
            'vid' => [
                'required'          => false,
                'sanitize_callback' => 'sanitize_text_field',
                'description'       => 'Veranstalter-ID oder mehrere durch Kommas getrennte Veranstalter-IDs.',
            ],
        ];
    }

    /**
     * Validiert, ob der Endpoint existiert.
     */
    public function validate_endpoint($value, $request, $param)
    {
        return array_key_exists($value, $this->base_endpoints);
    }

    /**
     * Haupt-Callback für das Abrufen der Daten.
     */
    public function handle_get_data(WP_REST_Request $request)
    {
        $params = $request->get_params();

        // Endpoint auslesen und entfernen, damit er nicht doppelt an die URL angehängt wird.
        $endpoint_key = $params['endpoint'];
        unset($params['endpoint']);

        // The provider combines organizers in one feed, including ordering and pagination.
        // Keep existing single-ID requests and all other endpoints unchanged.
        if ($endpoint_key === 'events' && isset($params['vid']) && is_string($params['vid'])) {
            $organizers = $this->normalize_organizer_ids($params['vid']);
            if (is_wp_error($organizers)) {
                return $organizers;
            }
            $params['vid'] = $organizers;
        }

        // Daten holen
        $data = $this->fetch_data($endpoint_key, $params);

        if (is_wp_error($data)) {
            return $data; 
        }

        return new WP_REST_Response($data, 200);
    }

    private function normalize_organizer_ids(string $value)
    {
        if (strpos($value, ',') === false) {
            return $value;
        }

        $ids = [];
        foreach (explode(',', $value) as $part) {
            $id = trim($part);
            // Tolerate a trailing comma and accidental empty entries while editing.
            if ($id === '') {
                continue;
            }
            if (!preg_match('/^[0-9]+$/D', $id) || ltrim($id, '0') === '') {
                return $this->invalid_organizer_ids();
            }
            $ids[] = ltrim($id, '0');
        }

        if (!$ids) {
            return $this->invalid_organizer_ids();
        }

        // Normalize before looking up the cache; whitespace and duplicates share one entry.
        return implode(',', array_unique($ids));
    }

    private function invalid_organizer_ids(): WP_Error
    {
        return new WP_Error(
            'ln_eta_invalid_organizer_ids',
            __('Bitte geben Sie Veranstalter-IDs als positive Zahlen ein, durch Kommas getrennt (z. B. 1081,562).', 'evangelische-termine-ausgeben'),
            ['status' => 400]
        );
    }

    /**
     * Daten holen und ggf. cachen
     */
    private function fetch_data($endpoint_key, $params, bool $refresh = false)
    {
        // Eindeutigen Transient-Key erzeugen
        ksort($params);
        $transient_key = self::TRANSIENT_PREFIX . md5($endpoint_key . http_build_query($params));
        $cached_data = get_transient($transient_key);

        if (!$refresh && $cached_data !== false) {
            return $cached_data;
        }

        $url = $this->build_url($this->base_endpoints[$endpoint_key], $params);

        $response = wp_remote_get($url, $refresh
            ? ['timeout' => 5, 'redirection' => 0, 'limit_response_size' => 2 * MB_IN_BYTES]
            : ['timeout' => 15]);

        if (is_wp_error($response)) {
            return new WP_Error('api_request_failed', __('Fehler beim Abrufen der Daten.', 'evangelische-termine-ausgeben'), ['status' => 502]);
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            return new WP_Error(
                'api_response_error',
                sprintf(
                    /* translators: %s: HTTP status code returned by the events API. */
                    __('Fehlerhafte API-Antwort: %s', 'evangelische-termine-ausgeben'),
                    $status_code
                ),
                ['status' => $status_code]
            );
        }

        $body = wp_remote_retrieve_body($response);

        // Prüfen, ob JSON oder ggf. XML - hier vereinfachen wir auf JSON.
        // Wenn XML: Nutzung von simplexml_load_string und Konvertierung zu Array.
        $data = json_decode($body, true);

        // [] is a valid empty calendar. Errors, XML and truncated JSON are not.
        if ($refresh) {
            if (json_last_error() !== JSON_ERROR_NONE || !self::valid_event_rows($data) || substr(ltrim($body), 0, 1) !== '[') {
                return new WP_Error('ln_eta_cache_response', __('Ungültige Antwort des Terminanbieters.', 'evangelische-termine-ausgeben'));
            }
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            // Fallback: Prüfen ob XML
            $xml = @simplexml_load_string($body);
            if ($xml !== false) {
                $data = json_decode(json_encode($xml), true);
            } else {
                return new WP_Error('decode_error', __('Fehler beim Dekodieren der Daten.', 'evangelische-termine-ausgeben'), ['status' => 500]);
            }
        }

        set_transient($transient_key, $data, self::TRANSIENT_LIFETIME);

        return $data;
    }

    /**
     * Baut die URL mit Query-Parametern auf.
     */
    private function build_url($base_url, $params)
    {
        if (!empty($params)) {
            return add_query_arg($params, $base_url);
        }
        return $base_url;
    }
}
