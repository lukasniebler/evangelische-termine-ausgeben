<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

class Blocks
{
    public function __construct()
    {
        add_action('init', [$this, 'evangelische_termine_ausgeben_elements_block_init']);
    }

    /**
     * Initializes the block registration and sets up localization.
     */
    public function evangelische_termine_ausgeben_elements_block_init()
    {
        $this->evangelische_termine_ausgeben_register_blocks_and_translations();
    }

    /**
     * Registers blocks and localizations.
     */
    private function evangelische_termine_ausgeben_register_blocks_and_translations()
    {
        $blocks = [
            'block-blueprint'
        ];

        foreach ($blocks as $block) {
            register_block_type(plugin_dir_path(__DIR__) . 'build/blocks/' . $block);

            // load_plugin_textdomain('evangelische-termine-ausgeben', false, dirname(plugin_basename(__DIR__)) . 'languages');

            $script_handle = generate_block_asset_handle('evangelische-termine/' . $block, 'editorScript');
            // wp_set_script_translations($script_handle, 'evangelische-termine-ausgeben', plugin_dir_path(__DIR__) . 'languages');
            //error log something
            error_log('script handle: ' . $script_handle);
        }

        // Register global styles and scripts here.
        // wp_enqueue_style('evangelische-termine-ausgeben');
    }
}
