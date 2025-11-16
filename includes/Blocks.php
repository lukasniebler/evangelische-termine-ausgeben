<?php

namespace LN\EvangelischeTermineAusgeben;

defined('ABSPATH') || exit;

class Blocks
{
    private BlockRender $renderer;

    public function __construct()
    {
        $this->renderer = new BlockRender();
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
            'evangelische-termine'
        ];

        foreach ($blocks as $block) {
            $args = [];

            if ($block === 'evangelische-termine') {
                $args['render_callback'] = [$this->renderer, 'render_block_blueprint'];
            }

            register_block_type(plugin_dir_path(__DIR__) . 'build/blocks/' . $block, $args);
            $script_handle = generate_block_asset_handle('evangelische-termine/' . $block, 'editorScript');

        }
    }
}
