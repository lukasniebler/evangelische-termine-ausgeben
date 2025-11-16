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

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_rest_routes']);
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
                'description'       => 'Veranstaltungs-ID',
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

        // Daten holen
        $data = $this->fetch_data($endpoint_key, $params);

        if (is_wp_error($data)) {
            return $data; 
        }

        return new WP_REST_Response($data, 200);
    }

    /**
     * Daten holen und ggf. cachen
     */
    private function fetch_data($endpoint_key, $params)
    {
        // Eindeutigen Transient-Key erzeugen
        ksort($params);
        $transient_key = self::TRANSIENT_PREFIX . md5($endpoint_key . http_build_query($params));
        $cached_data = get_transient($transient_key);

        if ($cached_data !== false) {
            return $cached_data;
        }

        $url = $this->build_url($this->base_endpoints[$endpoint_key], $params);

        $response = wp_remote_get($url, ['timeout' => 15]);

        if (is_wp_error($response)) {
            return new WP_Error('api_request_failed', __('Fehler beim Abrufen der Daten.', 'evangelische-termine-ausgeben'), ['status' => 502]);
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            return new WP_Error('api_response_error', sprintf(__('Fehlerhafte API-Antwort: %s', 'evangelische-termine-ausgeben'), $status_code), ['status' => $status_code]);
        }

        $body = wp_remote_retrieve_body($response);

        // Prüfen, ob JSON oder ggf. XML - hier vereinfachen wir auf JSON.
        // Wenn XML: Nutzung von simplexml_load_string und Konvertierung zu Array.
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            // Fallback: Prüfen ob XML
            $xml = @simplexml_load_string($body);
            if ($xml !== false) {
                $data = json_decode(json_encode($xml), true);
            } else {
                error_log('JSON/XML decode error: ' . json_last_error_msg());
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
