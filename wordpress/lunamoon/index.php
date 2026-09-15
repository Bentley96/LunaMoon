<?php
/**
 * Universal template.
 *
 * Every front-end URL the app owns renders this shell: React mounts into #root
 * and React Router decides which page to show from the URL. Because this is
 * index.php, it is WordPress's fallback for the front page, all pages and 404s,
 * and inc/commerce.php forces it back for WooCommerce's product and shop URLs —
 * so one template serves the whole app.
 *
 * WooCommerce keeps its own templates for /checkout and /my-account.
 *
 * @package LunaMoon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
	<div id="root"></div>
<?php wp_footer(); ?>
</body>
</html>
