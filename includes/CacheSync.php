<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

/** Opt-in page dependencies collected by rendering, never by public API requests. */
final class CacheSync
{
    public const OPTION = 'ln_eta_rocket_enabled';
    public const STATE = 'ln_eta_rocket_state';
    public const META = '_ln_eta_rocket_consumers';
    public const HOOK = 'ln_eta_rocket_check';
    public const LOCK = 'ln_eta_rocket_lock';
    private static int $page = 0;
    private static array $observed = [];
    private static bool $overflow = false;

    public function __construct()
    {
        add_filter('cron_schedules', [self::class, 'schedules']);
        add_action('init', [self::class, 'schedule'], 30);
        add_action('wp', [self::class, 'begin_page']);
        add_action('shutdown', [self::class, 'finish_page']);
        add_action(self::HOOK, [self::class, 'run']);
        add_action(self::HOOK . '_manual', static function () { self::run(true); });
    }

    public static function available(): bool
    {
        return function_exists('rocket_clean_files');
    }

    public static function enabled(): bool
    {
        return (bool) get_option(self::OPTION, false) && self::available();
    }

    public static function schedules(array $schedules): array
    {
        $schedules['ln_eta_five_minutes'] = [
            'interval' => 5 * MINUTE_IN_SECONDS,
            'display' => __('Alle fünf Minuten (Terminprüfung)', 'evangelische-termine-ausgeben'),
        ];
        return $schedules;
    }

    public static function schedule(): void
    {
        if (!self::enabled()) {
            wp_clear_scheduled_hook(self::HOOK);
            wp_clear_scheduled_hook(self::HOOK . '_manual');
        } elseif (!wp_next_scheduled(self::HOOK)) {
            wp_schedule_event(time() + MINUTE_IN_SECONDS, 'ln_eta_five_minutes', self::HOOK);
        }
    }

    public static function deactivate(bool $network_wide = false): void
    {
        if ($network_wide && is_multisite()) {
            for ($offset = 0; ; $offset += 100) {
                $ids = get_sites(['fields' => 'ids', 'number' => 100, 'offset' => $offset]);
                foreach ($ids as $id) {
                    switch_to_blog($id);
                    self::deactivate();
                    restore_current_blog();
                }
                if (count($ids) < 100) { break; }
            }
            return;
        }
        wp_clear_scheduled_hook(self::HOOK);
        wp_clear_scheduled_hook(self::HOOK . '_manual');
        delete_option(self::LOCK);
    }

    public static function begin_page(): void
    {
        self::$page = 0;
        self::$observed = [];
        self::$overflow = false;
        if (!self::enabled() || is_admin() || is_user_logged_in() || !is_singular()
            || is_preview() || is_feed() || (defined('REST_REQUEST') && REST_REQUEST)
            || (int) get_query_var('page') > 1) { return; }
        $post = get_queried_object();
        if (!$post instanceof \WP_Post || $post->post_status !== 'publish' || $post->post_password
            || !is_post_type_viewable($post->post_type)) { return; }
        // Track only canonical pages, not searches, event detail/PDF URLs or previews.
        $canonical_query = [];
        wp_parse_str((string) wp_parse_url(get_permalink($post), PHP_URL_QUERY), $canonical_query);
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only request classification.
        $query = wp_unslash($_GET);
        foreach ($query as $value) { if (!is_scalar($value)) { return; } }
        if (array_diff_assoc($query, $canonical_query)) { return; }
        self::$page = (int) $post->ID;
    }

    /** Called by a renderer with its actual output; does not modify that output. */
    public static function observe(string $type, array $query, array $attributes, string $output): void
    {
        if (!self::$page) { return; }
        $query = DataFetcher::event_params($query);
        if (is_wp_error($query)) { self::$overflow = true; return; }
        $consumer = ['type' => $type, 'query' => $query, 'attributes' => $attributes];
        $key = hash('sha256', wp_json_encode($consumer));
        $consumer['hash'] = hash('sha256', $output);
        self::$observed[$key] = $consumer;
        if (count(self::$observed) > 20 || strlen(wp_json_encode(self::$observed)) > 64 * KB_IN_BYTES) {
            self::$overflow = true;
        }
    }

    public static function finish_page(): void
    {
        $page = self::$page;
        self::$page = 0;
        $error = error_get_last();
        if (!$page || self::$overflow || http_response_code() >= 400
            || ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true))) { return; }
        $previous = get_post_meta($page, self::META, true);
        if (!self::$observed) {
            if ($previous) { delete_post_meta($page, self::META, $previous); }
            return;
        }
        $current = ['url' => get_permalink($page), 'consumers' => self::$observed];
        if ($current !== $previous) {
            // Compare-and-swap avoids overwriting a concurrent background comparison.
            update_post_meta($page, self::META, wp_slash($current), $previous);
        }
    }

    /** Refresh at most three distinct feeds per tick; sharing blocks reuse one request. */
    public static function run(bool $force = false): void
    {
        if (!self::enabled()) { return; }
        $now = time();
        $expires = (int) get_option(self::LOCK, 0);
        if ($expires && $expires < $now) { delete_option(self::LOCK); }
        if (!add_option(self::LOCK, $now + 120, '', false)) { return; }
        try {
            self::check_pages($now, $force);
        } finally {
            delete_option(self::LOCK);
        }
    }

    private static function check_pages(int $now, bool $force): void
    {
        $state = get_option(self::STATE, []);
        $state = is_array($state) ? $state : [];
        $feeds = $state['feeds'] ?? [];
        $batch = max(1, (int) ($state['batch'] ?? 1));
        $posts = get_posts([
            'post_type' => get_post_types(['public' => true]), 'post_status' => 'publish',
            'has_password' => false,
            // Intentional lookup of the rendering registry via WordPress's meta_key index, in batches of 50.
            'meta_key' => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
            'posts_per_page' => 50, 'paged' => $batch, 'orderby' => 'ID', 'order' => 'ASC',
        ]);
        $records = [];
        $queries = [];
        foreach ($posts as $post) {
            $record = get_post_meta($post->ID, self::META, true);
            if (!is_array($record) || empty($record['consumers'])) { continue; }
            $records[$post->ID] = $record;
            foreach ($record['consumers'] as $consumer) {
                $query = DataFetcher::event_params($consumer['query']);
                if (is_wp_error($query)) { continue; }
                $key = DataFetcher::event_cache_key($query);
                $queries[$key] = $query;
                $feeds[$key]['used'] = $now;
            }
        }
        // Oldest unchecked query first, so a large page cannot starve later blocks.
        uksort($queries, static fn ($a, $b) => ($feeds[$a]['attempt'] ?? 0) <=> ($feeds[$b]['attempt'] ?? 0));
        $requests = 0;
        $data = [];
        $pending = false;
        foreach ($queries as $key => $query) {
            $cached = get_transient($key);
            if (!DataFetcher::valid_event_rows($cached)) { $cached = false; }
            $feed = $feeds[$key] ?? [];
            $due = $force || $now >= ($feed['next'] ?? 0) || (!is_array($cached) && empty($feed['error']));
            if ($due && $requests < 3) {
                ++$requests;
                $fresh = DataFetcher::refresh_events($query);
                $feeds[$key]['attempt'] = $now;
                if (is_wp_error($fresh)) {
                    $failures = min(4, ($feed['failures'] ?? 0) + 1);
                    $feeds[$key] = array_merge($feeds[$key], [
                        'error' => $fresh->get_error_code(), 'failures' => $failures,
                        'next' => $now + min(30, 5 * (2 ** ($failures - 1))) * MINUTE_IN_SECONDS,
                    ]);
                    continue;
                }
                $feeds[$key] = ['attempt' => $now, 'success' => $now, 'used' => $now, 'next' => $now + 30 * MINUTE_IN_SECONDS];
                $cached = $fresh;
            } elseif ($due) {
                $pending = $pending || empty($feed['attempt']);
                continue;
            }
            if (empty($feeds[$key]['error']) && is_array($cached)) { $data[$key] = $cached; }
        }

        $changed = [];
        $unsupported = 0;
        foreach ($records as $id => $record) {
            $next = $record;
            foreach ($record['consumers'] as $key => $consumer) {
                $query = DataFetcher::event_params($consumer['query']);
                if (is_wp_error($query)) { ++$unsupported; continue 2; }
                $feed_key = DataFetcher::event_cache_key($query);
                if (!array_key_exists($feed_key, $data)) { continue 2; }
                $output = self::project($consumer, $data[$feed_key]);
                if (!is_string($output)) { ++$unsupported; continue 2; }
                $next['consumers'][$key]['hash'] = hash('sha256', $output);
            }
            $next['url'] = get_permalink($id);
            if ($next === $record) { continue; }
            // A page rendered meanwhile has a more recent baseline; leave it alone.
            if (get_post_meta($id, self::META, true) !== $record) { continue; }
            if (self::purge($next['url'])) {
                update_post_meta($id, self::META, wp_slash($next), $record);
                $changed[] = $id;
            } else {
                ++$unsupported;
            }
        }
        // Bound state and remove feeds no longer used by any recently checked page.
        $feeds = array_filter($feeds, static fn ($feed) => ($feed['used'] ?? 0) > $now - 7 * DAY_IN_SECONDS);
        uasort($feeds, static fn ($a, $b) => ($b['used'] ?? 0) <=> ($a['used'] ?? 0));
        $state = [
            'feeds' => array_slice($feeds, 0, 500, true),
            'batch' => $pending ? $batch : (count($posts) === 50 ? $batch + 1 : 1),
            'last_check' => $now, 'checked_pages' => count($records), 'requests' => $requests,
            'changed_pages' => $changed, 'unsupported' => $unsupported,
            'last_change' => $changed ? $now : ($state['last_change'] ?? 0),
            'last_success' => $requests && !array_filter($feeds, static fn ($feed) => !empty($feed['error']))
                ? $now : ($state['last_success'] ?? 0),
        ];
        update_option(self::STATE, $state, false);
    }

    public static function project(array $consumer, array $rows): ?string
    {
        if ($consumer['type'] === 'block') {
            $renderer = new BlockRender(static fn () => $rows, $consumer['attributes']['__ln_eta_place_types'] ?? []);
            return BlockRender::cache_output($renderer->render_block_blueprint($consumer['attributes']));
        }
        // Themes return the same stable value they supplied to observe().
        $value = apply_filters('ln_eta_cache_projection', null, $consumer['type'], $consumer['attributes'], $rows);
        return is_string($value) ? $value : null;
    }

    private static function purge(string $url): bool
    {
        $parts = wp_parse_url($url);
        if (!$parts || ($parts['host'] ?? '') !== wp_parse_url(home_url(), PHP_URL_HOST)
            || !empty($parts['query']) || !empty($parts['fragment'])) { return false; }
        // A bare directory URL recursively purges child pages in WP Rocket.
        // Match only this URL's index variants (desktop/mobile, SSL, gzip), even at /.
        // Rocket removes the filename expression before notifying its preloader.
        rocket_clean_files(trailingslashit($url) . 'index[-a-z0-9_]*\\x2ehtml(_gzip)*$');
        return true;
    }
}
