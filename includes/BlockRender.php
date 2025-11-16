<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

use WP_Error;
use WP_REST_Request;

class BlockRender
{
    private array $placeTypeMap = [];
    private bool $placeTypesLoaded = false;

    public function render_block_blueprint(array $attributes = []): string
    {
        $defaults = [
            'id' => '',
            'limit' => 10,
            'eventType' => '',
            'people' => '',
            'placeType' => '',
            'searchText' => '',
            'heading' => __('Veranstaltungen', 'evangelische-termine-ausgeben'),
        ];

        $attributes = wp_parse_args($attributes, $defaults);
        $queryArgs = $this->build_query_args($attributes);

        $events = $this->fetch_events($queryArgs);
        if (is_wp_error($events)) {
            return $this->render_wrapper(
                sprintf(
                    '<p class="ln-eta-error">%s</p>',
                    esc_html($events->get_error_message())
                )
            );
        }

        if (!is_array($events)) {
            return $this->render_wrapper('');
        }

        $events = $this->filter_by_place_type($events, $attributes['placeType']);
        $events = $this->filter_by_search($events, $attributes['searchText']);

        $heading = trim((string) ($attributes['heading'] ?? ''));
        if (empty($events)) {
            $content = sprintf(
                '%1$s<p>%2$s</p>',
                $heading !== '' ? '<h2>' . esc_html($heading) . '</h2>' : '',
                esc_html__('Keine Veranstaltungen gefunden.', 'evangelische-termine-ausgeben')
            );
            return $this->render_wrapper($content);
        }

        $items = array_map(function ($event) {
            $veranstaltung = $event['Veranstaltung'] ?? [];
            $title = isset($veranstaltung['_event_TITLE']) ? esc_html($veranstaltung['_event_TITLE']) : '';
            $datum = isset($veranstaltung['DATUM']) ? esc_html($veranstaltung['DATUM']) : '';
            $startTime = '';
            if (!empty($veranstaltung['START_UHRZEIT'])) {
                $startTime = esc_html(str_replace('.', ':', $veranstaltung['START_UHRZEIT']));
            }

            $detailUrl = $this->build_detail_url($veranstaltung['ID'] ?? '');
            $titleMarkup = $title;
            if ($title && $detailUrl) {
                $titleMarkup = sprintf(
                    '<a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a>',
                    esc_url($detailUrl),
                    $title
                );
            }

            $dt = sprintf('<dt>%s</dt>', $titleMarkup ? '<strong>' . $titleMarkup . '</strong>' : '');
            $cleanDate = $this->strip_time_from_datum($datum);
            $dateMarkup = $cleanDate ? sprintf('<dd class="ln-eta-date"><span class="ln-eta-date-text">%s</span></dd>', $cleanDate) : '';
            $timeMarkup = '';
            if ($startTime) {
                $timeMarkup = sprintf(
                    '<dd class="ln-eta-time"><span class="ln-eta-time-text">%s</span></dd>',
                    $startTime
                );
            }
            $locationText = $this->build_location_text($veranstaltung);
            $locationMarkup = $locationText !== ''
                ? sprintf('<dd class="ln-eta-location"><span class="ln-eta-location-text">%s</span></dd>', esc_html($locationText))
                : '';

            return $dt . $dateMarkup . $timeMarkup . $locationMarkup;
        }, $events);

        $headingMarkup = $heading !== '' ? '<h2>' . esc_html($heading) . '</h2>' : '';
        $content = sprintf(
            '%1$s<dl>%2$s</dl>',
            $headingMarkup,
            implode('', $items)
        );

        return $this->render_wrapper($content);
    }

    private function build_query_args(array $attributes): array
    {
        $params = [
            'endpoint' => 'events',
        ];

        if (!empty($attributes['id'])) {
            $params['vid'] = sanitize_text_field($attributes['id']);
        }

        $limit = isset($attributes['limit']) ? (int) $attributes['limit'] : 0;
        if ($limit > 0) {
            $params['itemsPerPage'] = $limit;
        }

        foreach (['eventType' => 'eventtype', 'people' => 'people', 'placeType' => 'placetype'] as $attr => $param) {
            if (!empty($attributes[$attr])) {
                $params[$param] = sanitize_text_field($attributes[$attr]);
            }
        }

        return $params;
    }

    private function fetch_events(array $queryArgs)
    {
        $request = new WP_REST_Request('GET', '/evangelische-termine-ausgeben/v1/data');
        foreach ($queryArgs as $key => $value) {
            $request->set_param($key, $value);
        }

        $response = rest_do_request($request);
        if (is_wp_error($response)) {
            return $response;
        }

        if ($response instanceof WP_Error) {
            return $response;
        }

        $data = $response->get_data();

        if (!is_array($data)) {
            return new WP_Error('ln_eta_invalid_response', __('Fehlerhafte Antwort vom Server.', 'evangelische-termine-ausgeben'));
        }

        return $data;
    }

    private function filter_by_place_type(array $events, string $placeType): array
    {
        if ($placeType === '') {
            return $events;
        }

        $label = $this->get_place_type_label($placeType);
        if (!$label) {
            return $events;
        }

        return array_values(array_filter($events, function ($event) use ($label) {
            return isset($event['Veranstaltung']['_place_KAT'])
                && $event['Veranstaltung']['_place_KAT'] === $label;
        }));
    }

    private function filter_by_search(array $events, string $searchText): array
    {
        $searchText = trim(
            wp_strip_all_tags(
                $searchText
            )
        );

        if ($searchText === '') {
            return $events;
        }

        $needle = mb_strtolower($searchText);

        return array_values(array_filter($events, function ($event) use ($needle) {
            $veranstaltung = $event['Veranstaltung'] ?? [];
            $haystack = [];

            foreach (['_event_TITLE', '_event_SHORT_DESCRIPTION', '_event_LONG_DESCRIPTION'] as $key) {
                if (!empty($veranstaltung[$key])) {
                    $haystack[] = mb_strtolower((string) $veranstaltung[$key]);
                }
            }

            foreach ($haystack as $text) {
                if (str_contains($text, $needle)) {
                    return true;
                }
            }

            return false;
        }));
    }

    private function get_place_type_label(string $placeType): ?string
    {
        if ($placeType === '') {
            return null;
        }

        if (!$this->placeTypesLoaded) {
            $this->load_place_types();
        }

        return $this->placeTypeMap[$placeType] ?? null;
    }

    private function build_detail_url(string $eventId): string
    {
        $eventId = trim($eventId);
        if ($eventId === '') {
            return '';
        }

        return sprintf('https://www.evangelische-termine.de/d-%s', rawurlencode($eventId));
    }

    private function build_location_text(array $veranstaltung): string
    {
        $parts = [];
        if (!empty($veranstaltung['_place_NAME'])) {
            $parts[] = (string) $veranstaltung['_place_NAME'];
        }

        $addressSegments = [];
        if (!empty($veranstaltung['_place_STREET_NR'])) {
            $addressSegments[] = (string) $veranstaltung['_place_STREET_NR'];
        }

        $citySegment = trim(sprintf(
            '%s %s',
            $veranstaltung['_place_ZIP'] ?? '',
            $veranstaltung['_place_CITY'] ?? ''
        ));
        if ($citySegment !== '') {
            $addressSegments[] = $citySegment;
        }

        if (!empty($addressSegments)) {
            $parts[] = implode(', ', $addressSegments);
        }

        return trim(implode(', ', array_filter($parts, function ($part) {
            return $part !== '';
        })));
    }

    private function strip_time_from_datum(string $datum): string
    {
        $trimmed = trim($datum);
        if ($trimmed === '') {
            return '';
        }

        $pattern = '/\s+\d{1,2}(?:[:\.]\d{1,2})?(?:\s*-\s*\d{1,2}(?:[:\.]\d{1,2})?)?\s*Uhr/iu';
        $clean = preg_replace($pattern, '', $trimmed);

        return $clean !== null ? trim($clean) : $trimmed;
    }

    private function load_place_types(): void
    {
        $this->placeTypesLoaded = true;

        $request = new WP_REST_Request('GET', '/evangelische-termine-ausgeben/v1/data');
        $request->set_param('endpoint', 'placetype');

        $response = rest_do_request($request);
        if (is_wp_error($response)) {
            return;
        }

        $data = $response->get_data();
        if (!is_array($data)) {
            return;
        }

        foreach ($data as $item) {
            if (isset($item['id'], $item['name'])) {
                $this->placeTypeMap[(string) $item['id']] = (string) $item['name'];
            }
        }
    }

    private function render_wrapper(string $content): string
    {
        $wrapperAttributes = get_block_wrapper_attributes();
        return sprintf('<div %s>%s</div>', $wrapperAttributes, $content);
    }
}
