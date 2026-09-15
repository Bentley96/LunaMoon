<?php
/**
 * WooCommerce integration.
 *
 * URL ownership is the thing to understand here. The React app owns browsing
 * and the basket; WooCommerce keeps everything from checkout onwards, because
 * that is where gateway card fields, 3-D Secure returns, order-pay links and
 * account pages all live:
 *
 *   /shop, /shop/<slug>, /cart   -> React (Store API)
 *   /checkout/...                -> WooCommerce (native)
 *   /my-account/...              -> WooCommerce (native)
 *
 * The hand-off works because both sides read the SAME cart. The Store API
 * writes to the visitor's WooCommerce session, so as long as the app's fetches
 * are same-origin and send credentials (they are, and they do), the basket the
 * visitor filled in React is the basket WooCommerce's checkout loads. The
 * Cart-Token header is only a fallback for browsers that drop the cookie.
 *
 * @package LunaMoon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Is WooCommerce active?
 *
 * @return bool
 */
function lunamoon_has_woo() {
	return class_exists( 'WooCommerce' );
}

/**
 * Declare WooCommerce support so it stops asking the theme to.
 */
add_action( 'after_setup_theme', 'lunamoon_woo_support' );
function lunamoon_woo_support() {
	add_theme_support( 'woocommerce' );
}

/**
 * Front-end paths WooCommerce renders itself, rather than the React app.
 *
 * Read from WooCommerce's own page settings rather than hard-coded, so a site
 * that renamed its checkout or account page still resolves correctly.
 *
 * @return string[]
 */
function lunamoon_woo_owned_paths() {
	$paths = array();

	if ( lunamoon_has_woo() ) {
		foreach ( array( 'woocommerce_checkout_page_id' => 'checkout', 'woocommerce_myaccount_page_id' => 'my-account' ) as $option => $fallback ) {
			$page_id = (int) get_option( $option );
			$slug    = $page_id ? get_post_field( 'post_name', $page_id ) : '';
			$paths[] = $slug ? $slug : $fallback;
		}
	}

	return (array) apply_filters( 'lunamoon_woo_owned_paths', $paths );
}

/**
 * Does the current request belong to WooCommerce rather than the app?
 *
 * Matches the path prefix so Woo's endpoint URLs
 * (/checkout/order-received/123/, /my-account/orders/) are included.
 *
 * @return bool
 */
function lunamoon_is_woo_owned_request() {
	if ( ! lunamoon_has_woo() ) {
		return false;
	}

	$path = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH );
	$path = trim( (string) $path, '/' );

	// Strip the subdirectory prefix when WordPress isn't at the domain root.
	$base = trim( (string) lunamoon_basename(), '/' );
	if ( '' !== $base && 0 === strpos( $path, $base ) ) {
		$path = trim( substr( $path, strlen( $base ) ), '/' );
	}

	foreach ( lunamoon_woo_owned_paths() as $owned ) {
		$owned = trim( (string) $owned, '/' );
		if ( '' === $owned ) {
			continue;
		}
		if ( $path === $owned || 0 === strpos( $path, $owned . '/' ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Serve the SPA shell for everything except the WooCommerce-owned paths.
 *
 * index.php is already WordPress's fallback template, but WooCommerce swaps in
 * its own templates for product and shop URLs — this puts the app back.
 *
 * @param string $template Resolved template path.
 * @return string
 */
add_filter( 'template_include', 'lunamoon_template_include', 99 );
function lunamoon_template_include( $template ) {
	if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return $template;
	}

	if ( lunamoon_is_woo_owned_request() ) {
		return $template;
	}

	return get_template_directory() . '/index.php';
}

/**
 * Keep WooCommerce's own stylesheets off the app's pages.
 *
 * They're only needed where Woo renders its own markup; everywhere else they
 * add weight and fight the theme's Tailwind styles.
 */
add_action( 'wp_enqueue_scripts', 'lunamoon_dequeue_woo_styles', 99 );
function lunamoon_dequeue_woo_styles() {
	if ( ! lunamoon_has_woo() || lunamoon_is_woo_owned_request() ) {
		return;
	}

	foreach ( array( 'woocommerce-general', 'woocommerce-layout', 'woocommerce-smallscreen', 'wc-blocks-style' ) as $handle ) {
		wp_dequeue_style( $handle );
	}
}
