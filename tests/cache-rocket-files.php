<?php
/** Optional test against genuine WP Rocket sources, using only disposable cache files. */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }
if (empty($argv[2])) { throw new RuntimeException('Pass wp-load.php and the WP Rocket inc/functions directory.'); }
require $argv[1];
if (function_exists('rocket_clean_files') || defined('WP_ROCKET_CACHE_PATH')) { throw new RuntimeException('Run only without a real installed WP Rocket'); }
define('WP_ROCKET_CACHE_PATH', sys_get_temp_dir() . '/eta-rocket-isolated-' . bin2hex(random_bytes(5)) . '/');
function rocket_get_constant($name, $default = null) { return defined($name) ? constant($name) : $default; }
require rtrim($argv[2], '/') . '/formatting.php';
require rtrim($argv[2], '/') . '/files.php';
use LN\EvangelischeTermineAusgeben\CacheSync;
$host = wp_parse_url(home_url(), PHP_URL_HOST);
$root = WP_ROCKET_CACHE_PATH . $host;
$files = [
    'index.html', 'index-https.html_gzip', 'index-mobile-https.html',
    'kids/index.html', 'kids/index-https-mobile.html_gzip', 'kids/child/index.html',
    'other/index.html',
];
foreach ($files as $file) { wp_mkdir_p(dirname($root . '/' . $file)); file_put_contents($root . '/' . $file, 'cache'); }
$hooks = [];
add_action('after_rocket_clean_file', static function ($url) use (&$hooks) { $hooks[] = $url; });
$method = new ReflectionMethod(CacheSync::class, 'purge');
$method->invoke(null, home_url('/kids/'));
if (file_exists($root . '/kids/index.html') || file_exists($root . '/kids/index-https-mobile.html_gzip')) { throw new RuntimeException('Page variants survived purge'); }
if (!file_exists($root . '/kids/child/index.html') || !file_exists($root . '/other/index.html') || !file_exists($root . '/index.html')) { throw new RuntimeException('An unrelated page was removed'); }
if ($hooks !== [home_url('/kids/')]) { throw new RuntimeException('Preload hook did not receive a canonical URL: ' . json_encode($hooks)); }
echo "PASS: actual WP Rocket function deletes only target page variants, preserves descendants and forwards canonical preload URL\n";
$method->invoke(null, home_url('/'));
if (file_exists($root . '/index.html') || file_exists($root . '/index-https.html_gzip') || file_exists($root . '/index-mobile-https.html')) { throw new RuntimeException('Homepage variants survived'); }
if (!file_exists($root . '/kids/child/index.html') || !file_exists($root . '/other/index.html')) { throw new RuntimeException('Homepage purge removed subpages'); }
if (end($hooks) !== home_url('/')) { throw new RuntimeException('Missing homepage preload URL'); }
echo "PASS: homepage purge preserves the entire remaining site and triggers its preload hook\n";
if ($method->invoke(null, home_url('/?kirchentermin=123')) || $method->invoke(null, 'https://example.invalid/')) { throw new RuntimeException('Foreign or query URL accepted'); }
echo "PASS: query and foreign URLs rejected\n";
rocket_direct_filesystem()->delete(WP_ROCKET_CACHE_PATH, true);
