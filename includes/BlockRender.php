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

        if (!empty($attributes['legacy']) && $attributes['legacy'] === true) {
            return $this->render_legacy_format($attributes);
        }

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
            $endTime = '';
            if (!empty($veranstaltung['END_UHRZEIT'])) {
                $endTime = esc_html(str_replace('.', ':', $veranstaltung['END_UHRZEIT']));
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
            $timeText = $this->build_time_text($startTime, $endTime);
            if ($timeText !== '') {
                $timeMarkup = sprintf(
                    '<dd class="ln-eta-time"><span class="ln-eta-time-text">%s</span></dd>',
                    esc_html($timeText)
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

    /**
     * Outputs the legacy snippet in the “legacy” format.
     *
     * @param  array $attributes
     * @return string
     */
    /**
     * Renders the legacy view.
     *
     * @param  array $attributes
     * @return string
     */
    public function render_legacy_format(array $attributes): string
    {
        $defaults = [
            'id'         => '',
            'limit'      => 10,
            'eventType'  => '',
            'people'     => '',
            'placeType'  => '',
            'searchText' => '',
            'heading'    => __('Veranstaltungen', 'evangelische-termine-ausgeben'),
        ];

        $attributes = wp_parse_args($attributes, $defaults);
        $queryArgs  = $this->build_query_args($attributes);

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

        $html  = '<div id="et_container">' . "\n";
        $html .= '   <div id="et_content_container">' . "\n";

        $i = 0;
        foreach ($events as $event) {
            $veranstaltung = $event['Veranstaltung'] ?? [];
            $title = isset($veranstaltung['_event_TITLE']) ? esc_html($veranstaltung['_event_TITLE']) : '';
            $datum = isset($veranstaltung['DATUM']) ? esc_html($veranstaltung['DATUM']) : '';

            $startTime = !empty($veranstaltung['START_UHRZEIT'])
                ? esc_html(str_replace('.', ':', $veranstaltung['START_UHRZEIT']))
                : '';
            $endTime = !empty($veranstaltung['END_UHRZEIT'])
                ? esc_html(str_replace('.', ':', $veranstaltung['END_UHRZEIT']))
                : '';

            // Prefer _event_ID over ID for the detail link.
            $eventID = !empty($veranstaltung['_event_ID']) ? $veranstaltung['_event_ID'] : ($veranstaltung['ID'] ?? '');
            $detailUrl = $this->build_detail_url($eventID);

            if (stripos($datum, 'Uhr') !== false) {
                // If DATUM already contains a time indicator, use it as is.
                $dateTimeStr = $datum;
            } else {
                // Otherwise, append the time text if available.
                $timeText = $this->build_time_text($startTime, $endTime);
                $dateTimeStr = $timeText !== '' ? $datum . ' ' . $timeText : $datum;
            }

            // Use the _inputmask_NAME as the legacy lit name.
            $litName = isset($veranstaltung['_inputmask_NAME']) ? esc_html($veranstaltung['_inputmask_NAME']) : '';
            // Person name from _person_NAME.
            $personName = isset($veranstaltung['_person_NAME']) ? esc_html($veranstaltung['_person_NAME']) : '';

            // Build location using _place_CITY and _place_NAME.
            $cityName  = isset($veranstaltung['_place_CITY']) ? esc_html($veranstaltung['_place_CITY']) : '';
            $placename = isset($veranstaltung['_place_NAME']) ? esc_html($veranstaltung['_place_NAME']) : '';
            $location = ($cityName && $placename) ? $cityName . ': ' . $placename : ($cityName . $placename);

            // Alternate row classes.
            $rowClass = ($i % 2 === 0) ? 'et_even teaserrow' : 'et_odd';

            $html .= '       <div class="et_content_row ' . $rowClass . '">' . "\n";
            $html .= '           <div class="et_content_date teaserdate">' . $dateTimeStr;
            if ($litName) {
                $html .= '<br><span class="et_litname">' . $litName . '</span>';
            }
            $html .= '</div>' . "\n";

            $html .= '           <div class="et_content_title">' . "\n";
            $html .= '               <span class="teaserlink">' . "\n";
            $html .= '                   <a href="javascript:;" onclick="ET_openWindow(\'' . esc_js($detailUrl) . '\',\'Detail\',\'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=650,top=10,left=200\');" class="et_link_title">';
            $html .= $title;
            $html .= '</a>' . "\n";
            $html .= '               </span>' . "\n";
            $html .= '               <span class="teasertext">';
            if ($personName) {
                $html .= '<span class="et_personname">' . $personName . '</span>';
            }
            if ($cityName || $placename) {
                $html .= '<br>';
                if ($cityName) {
                    $html .= '<span class="et_city">' . $cityName . ': </span>';
                }
                if ($placename) {
                    $html .= '<span class="et_placename teaserplace">' . $placename . '</span>';
                }
            }
            $html .= '</span>' . "\n";
            $html .= '           </div>' . "\n";
            $html .= '       </div>' . "\n";

            $i++;
        }

        $html .= '   </div>' . "\n";
        $html .= '</div>';

        return $this->render_wrapper($html);
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

    private function build_time_text(string $startTime, string $endTime): string
    {
        if ($startTime !== '' && $endTime !== '') {
            return sprintf('%s - %s', $startTime, $endTime);
        }

        if ($startTime !== '') {
            return $startTime;
        }

        if ($endTime !== '') {
            return $endTime;
        }

        return '';
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
