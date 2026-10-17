=== Evangelische Termine Ausgeben ===
Contributors: Lukas Niebler
Tags: events, calendar, church, block, evangelische termine
Requires at least: 6.7
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.1.0
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

A plugin to display church events from Evangelische Termine.

== Description ==

Display church events from the Evangelische Termine calendar in the WordPress block editor. Choose one organizer or enter multiple organizer IDs separated by commas to display their events in a combined list.

The block supports event limits and filtering, including an optional search in event titles only. Existing blocks with a single organizer ID continue to work. The Legacy/Senior mode preserves its existing HTML structure and styling.

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/` directory, or install the plugin ZIP through Plugins > Add New Plugin > Upload Plugin.
2. Activate the plugin through the Plugins screen in WordPress.
3. Add the Evangelische Termine block to a post or page and enter your organizer ID in the block settings.

== Frequently Asked Questions ==

= How do I use the block? =

After activating the plugin, find the Evangelische Termine block in the block inserter under the Evangelische Termine Ausgabe category. Add it to your content and configure it in the block settings.

= Can I display events from two organizers together? =

Yes. Enter comma-separated IDs in the organizer ID field (Veranstalter-ID(s)), for example `1081,562`. The event limit applies to the combined list. Extra spaces and duplicate IDs are removed. You can still enter a single organizer ID.

= Does this also work in Legacy/Senior mode? =

Yes. The existing HTML structure and styling are preserved. Events from another organizer are included only when you add that organizer's ID to the block. Existing blocks are not changed automatically.

== Changelog ==

= 1.1.0 =
* Support multiple comma-separated organizer IDs with a combined event limit and normalization of spaces and duplicate IDs.
* Preserve single-organizer configurations and the HTML structure and styles of Legacy/Senior mode.
* Show clear errors for invalid ID lists and prevent outdated requests from overwriting the editor preview.
* Add optional title-only search and support for dynamic blocks in page patterns.

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.1.0 =
To include multiple organizers, add their IDs to the relevant block. Existing single-organizer blocks and Legacy/Senior output are preserved. No migration is required.

== License ==

This plugin is licensed under the GNU General Public License v3.

== Notes ==

Report feedback and bugs as issues in the GitHub repository.

For more information, visit the [Evangelische Termine Ausgeben repository](https://github.com/lukasniebler/evangelische-termine-ausgeben).

