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
		// page.php, not whatever template the page has been assigned. A site
		// that was built with Elementor usually has "Elementor Full Width" set
		// on its checkout page, and that template prints the content on its
		// own: no title band, and none of the markup the theme's WooCommerce
		// styling hangs off. Forcing page.php means these two pages look the
		// same whatever the page was set to before the theme changed.
		$page = get_template_directory() . '/page.php';
		if ( file_exists( $page ) ) {
			return $page;
		}
		return $template;
	}

	return get_template_directory() . '/index.php';
}

/**
 * Print the WooCommerce page's own content, without the builder layout round it.
 *
 * A checkout page that was built with Elementor doesn't hold a bare shortcode.
 * It holds a section, holding a column, holding a widget, holding the
 * shortcode, plus whatever else was dropped on the page: a heading that repeats
 * the page title, an empty spacer section. The builder's stylesheet is what
 * gives all of that its size, and on these two pages the theme takes that
 * stylesheet off, so the layout is left standing with nothing holding it up:
 * a tall empty band above the form, and a second "Checkout" heading above the
 * theme's own.
 *
 * Nothing on a checkout page needs a builder. WooCommerce's shortcode renders
 * the whole thing. So when the page was built with one, this renders the
 * shortcode and leaves the layout out of it.
 *
 * @return bool True when it printed something, false to fall back to the_content().
 */
function lunamoon_woo_page_content() {
	if ( ! lunamoon_has_woo() ) {
		return false;
	}

	$post = get_post();
	if ( ! $post ) {
		return false;
	}

	$shortcodes = array(
		(int) get_option( 'woocommerce_checkout_page_id' )  => 'woocommerce_checkout',
		(int) get_option( 'woocommerce_myaccount_page_id' ) => 'woocommerce_my_account',
	);

	$id = (int) $post->ID;
	if ( empty( $shortcodes[ $id ] ) ) {
		return false;
	}

	/**
	 * Filter whether to bypass a page builder's layout on this page.
	 *
	 * Set false to render the page's real content instead, for a site that has
	 * deliberately put something on its checkout page.
	 *
	 * @param bool    $bypass Whether to render the shortcode on its own.
	 * @param WP_Post $post   The page.
	 */
	if ( ! apply_filters( 'lunamoon_bypass_builder_content', lunamoon_is_builder_page( $post ), $post ) ) {
		return false;
	}

	echo do_shortcode( '[' . $shortcodes[ $id ] . ']' );
	return true;
}

/**
 * Was this page built with a page builder rather than the editor?
 *
 * Each builder marks its posts with a meta key; these are the three that turn
 * up on a WordPress site of this vintage.
 *
 * @param WP_Post $post The page.
 * @return bool
 */
function lunamoon_is_builder_page( $post ) {
	if ( 'builder' === get_post_meta( $post->ID, '_elementor_edit_mode', true ) ) {
		return true;
	}
	if ( 'on' === get_post_meta( $post->ID, '_et_pb_use_builder', true ) ) {
		return true;
	}
	if ( 'true' === get_post_meta( $post->ID, '_wpb_vc_js_status', true ) ) {
		return true;
	}
	return false;
}

/**
 * Send WooCommerce's cart page to the app's basket.
 *
 * The app owns the basket, at /cart. WooCommerce has a cart page of its own,
 * and on a site that was set up before this theme it is usually called
 * something else: this one's is "Basket", at /basket/. Nothing in the app links
 * there, but WooCommerce does. Opening the checkout with nothing in the basket
 * is a redirect to the cart page, and that URL landed on the app with no route
 * to match it, so it showed the "page not found" screen.
 *
 * Redirecting rather than routing keeps one URL for the basket.
 *
 * The query string is dropped deliberately. WooCommerce's own cart links carry
 * ?add-to-cart= and ?remove_item=, which it acts on before this runs; carrying
 * them to the next request would apply them a second time.
 */
add_action( 'template_redirect', 'lunamoon_redirect_woo_cart' );
function lunamoon_redirect_woo_cart() {
	if ( is_admin() || ! lunamoon_has_woo() || ! function_exists( 'is_cart' ) || ! is_cart() ) {
		return;
	}

	$target = home_url( '/cart/' );
	$here   = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH );

	// Already on it: a site whose WooCommerce cart page IS /cart, where this
	// would otherwise redirect to itself forever.
	if ( untrailingslashit( (string) $here ) === untrailingslashit( (string) wp_parse_url( $target, PHP_URL_PATH ) ) ) {
		return;
	}

	wp_safe_redirect( $target, 302 );
	exit;
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
