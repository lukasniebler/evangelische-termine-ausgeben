<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

final class CacheSettings
{
    public function __construct()
    {
        add_action('admin_menu', static function () {
            add_options_page(__('Evangelische Termine', 'evangelische-termine-ausgeben'), __('Evangelische Termine', 'evangelische-termine-ausgeben'), 'manage_options', 'ln-eta-cache', [self::class, 'render']);
        });
        add_action('admin_init', static function () {
            register_setting('ln_eta_cache', CacheSync::OPTION, [
                'type' => 'boolean', 'default' => false,
                'sanitize_callback' => static fn ($value) => (bool) $value,
            ]);
        });
        add_action('update_option_' . CacheSync::OPTION, [CacheSync::class, 'schedule']);
        add_action('add_option_' . CacheSync::OPTION, [CacheSync::class, 'schedule']);
        add_action('admin_post_ln_eta_check_events', [self::class, 'request_check']);
    }

    public static function request_check(): void
    {
        if (!current_user_can('manage_options')) { wp_die(esc_html__('Keine Berechtigung.', 'evangelische-termine-ausgeben'), '', ['response' => 403]); }
        check_admin_referer('ln_eta_check_events');
        if (CacheSync::enabled() && !get_transient('ln_eta_manual_check') && !wp_next_scheduled(CacheSync::HOOK . '_manual')) {
            set_transient('ln_eta_manual_check', 1, MINUTE_IN_SECONDS);
            wp_schedule_single_event(time() + 1, CacheSync::HOOK . '_manual');
        }
        wp_safe_redirect(admin_url('options-general.php?page=ln-eta-cache'));
        exit;
    }

    public static function render(): void
    {
        if (!current_user_can('manage_options')) { return; }
        $enabled = (bool) get_option(CacheSync::OPTION, false);
        $state = get_option(CacheSync::STATE, []);
        $errors = array_filter($state['feeds'] ?? [], static fn ($feed) => !empty($feed['error']));
        $date = static fn ($time) => $time ? wp_date(get_option('date_format') . ' ' . get_option('time_format'), $time) : __('Noch nicht erfolgt', 'evangelische-termine-ausgeben');
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Evangelische Termine · Seiten-Cache', 'evangelische-termine-ausgeben'); ?></h1>
            <p><?php esc_html_e('Terminlisten melden ihre Seite beim ersten öffentlichen Aufruf automatisch an. Nur wenn sich die angezeigte Liste ändert, wird ihr WP-Rocket-Cache erneuert.', 'evangelische-termine-ausgeben'); ?></p>
            <?php if (!CacheSync::available()) : ?>
                <div class="notice notice-info inline"><p><?php esc_html_e('WP Rocket ist nicht aktiv. Die Anbindung pausiert; die normale Terminausgabe funktioniert unverändert.', 'evangelische-termine-ausgeben'); ?></p></div>
            <?php endif; ?>
            <?php if ($errors) : ?>
                <div class="notice notice-warning inline"><p><?php esc_html_e('Mindestens eine Terminabfrage ist fehlgeschlagen. Betroffene Seiten werden deshalb nicht geleert. Der nächste Versuch erfolgt automatisch.', 'evangelische-termine-ausgeben'); ?></p></div>
            <?php endif; ?>
            <?php if (!empty($state['unsupported'])) : ?>
                <div class="notice notice-warning inline"><p><?php esc_html_e('Eine gespeicherte Terminseite konnte nicht verglichen oder gezielt geleert werden. Bitte Theme-Anbindung und sprechende Permalinks prüfen und die Seite öffentlich neu aufrufen.', 'evangelische-termine-ausgeben'); ?></p></div>
            <?php endif; ?>
            <form method="post" action="options.php">
                <?php settings_fields('ln_eta_cache'); ?>
                <input type="hidden" name="<?php echo esc_attr(CacheSync::OPTION); ?>" value="0">
                <p><label><input type="checkbox" name="<?php echo esc_attr(CacheSync::OPTION); ?>" value="1" <?php checked($enabled); ?>>
                    <?php esc_html_e('WP-Rocket-Anbindung aktivieren', 'evangelische-termine-ausgeben'); ?>
                </label></p>
                <p class="description"><?php esc_html_e('Standardmäßig aus. Die Einstellung gilt nur für diese Website. Legacy/Senior-Ausgabe und Gestaltung bleiben unverändert.', 'evangelische-termine-ausgeben'); ?></p>
                <?php submit_button(); ?>
            </form>
            <h2><?php esc_html_e('Status', 'evangelische-termine-ausgeben'); ?></h2>
            <p><?php echo esc_html__('Letzte Prüfung: ', 'evangelische-termine-ausgeben') . esc_html($date($state['last_check'] ?? 0)); ?></p>
            <p><?php echo esc_html__('Letzte erfolgreiche Datenaktualisierung: ', 'evangelische-termine-ausgeben') . esc_html($date($state['last_success'] ?? 0)); ?></p>
            <p><?php echo esc_html__('Letzte Cache-Erneuerung wegen geänderter Termine: ', 'evangelische-termine-ausgeben') . esc_html($date($state['last_change'] ?? 0)); ?></p>
            <p><?php esc_html_e('Neue Daten werden etwa alle 30 Minuten abgefragt; zeitabhängige Anzeigen alle fünf Minuten geprüft. Viele unterschiedliche Listen werden in kleinen Gruppen bearbeitet. Bei Fehlern wird die Abfrage verzögert wiederholt.', 'evangelische-termine-ausgeben'); ?></p>
            <p><?php esc_html_e('Nach dem Aktivieren bereits gecachte Terminseiten einmal in WP Rocket leeren und öffentlich aufrufen oder vorladen. Mit aktiviertem Vorladen baut WP Rocket geleerte Seiten wieder auf; sonst geschieht das beim nächsten Besuch.', 'evangelische-termine-ausgeben'); ?></p>
            <p><?php esc_html_e('Für zuverlässige Prüfungen den Hosting-Anbieter wp-cron.php alle fünf Minuten aufrufen lassen. Ein Seiten-Cache kann die besuchsgesteuerte WordPress-Planung verzögern. WP-CLI ist dafür nicht erforderlich.', 'evangelische-termine-ausgeben'); ?></p>
            <?php if (CacheSync::enabled()) : ?>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <input type="hidden" name="action" value="ln_eta_check_events">
                    <?php wp_nonce_field('ln_eta_check_events'); ?>
                    <?php submit_button(__('Terminprüfung anfordern', 'evangelische-termine-ausgeben'), 'secondary'); ?>
                </form>
            <?php endif; ?>
        </div>
        <?php
    }
}
