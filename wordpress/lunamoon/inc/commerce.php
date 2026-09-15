<?php
/**
 * WooCommerce integration.
 *
 * URL ownership is the thing to understand here. The React app owns browsing
 * and the basket; WooCommerce keeps the pages where money and accounts are
 * actually handled, because those need its own rendering (gateway card fields,
 * 3-D Secure returns, order-pay links in emails, account pages):
 *
 *   /shop, /shop/<slug>, /cart, /checkout   -> React (Store API)
 *   /secure-checkout/...                    -> WooCommerce (native checkout)
 *   /my-account/...                         -> WooCommerce (native)
 *
 * Moving Woo's checkout page to /secure-checkout is what keeps /checkout free
 * for the app. The React checkout posts to the Store API and handles gateways
 * that redirect; anything needing on-page card fields is sent to
 * /secure-checkout, which is why that page still exists.
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
 * Slug of the page that renders WooCommerce's native checkout.
 *
 * @return string
 */
function lunamoon_secure_checkout_slug() {
	return (string) apply_filters( 'lunamoon_secure_checkout_slug', 'secure-checkout' );
}

/**
 * Front-end paths WooCommerce renders itself, rather than the React app.
 *
 * @return string[]
 */
function lunamoon_woo_owned_paths() {
	$paths = array( lunamoon_secure_checkout_slug() );

	if ( lunamoon_has_woo() ) {
		$account = get_option( 'woocommerce_myaccount_page_id' );
		$account = $account ? get_post_field( 'post_name', $account ) : 'my-account';
		if ( $account ) {
			$paths[] = $account;
		}
	}

	return (array) apply_filters( 'lunamoon_woo_owned_paths', $paths );
}

/**
 * Does the current request belong to WooCommerce rather than the app?
 *
 * Matches the path prefix so Woo's endpoint URLs
 * (/secure-checkout/order-received/123/, /my-account/orders/) are included.
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

/**
 * GET /lunamoon/v1/payment-methods
 *
 * The Store API doesn't expose the enabled gateway list (WooCommerce Blocks
 * reads it from a PHP-registered JS data store), so the checkout reads it here.
 */
add_action( 'rest_api_init', 'lunamoon_register_commerce_routes' );
function lunamoon_register_commerce_routes() {
	register_rest_route(
		'lunamoon/v1',
		'/payment-methods',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true',
			'callback'            => 'lunamoon_rest_payment_methods',
		)
	);
}

/**
 * Gateways that capture card details on the page and therefore can't be driven
 * by a plain Store API POST — the checkout sends these to /secure-checkout.
 *
 * @return string[]
 */
function lunamoon_hosted_field_gateways() {
	return (array) apply_filters(
		'lunamoon_hosted_field_gateways',
		array( 'stripe', 'stripe_cc', 'square_credit_card', 'braintree_credit_card', 'authorize_net_cim_credit_card' )
	);
}

/**
 * Build the enabled-gateway list for the checkout.
 *
 * @return WP_REST_Response
 */
function lunamoon_rest_payment_methods() {
	if ( ! lunamoon_has_woo() ) {
		return rest_ensure_response( array() );
	}

	$gateways = WC()->payment_gateways() ? WC()->payment_gateways()->get_available_payment_gateways() : array();
	$hosted   = lunamoon_hosted_field_gateways();
	$out      = array();

	foreach ( $gateways as $gateway ) {
		$out[] = array(
			'id'                => $gateway->id,
			'title'             => wp_strip_all_tags( $gateway->get_title() ),
			'description'       => wp_strip_all_tags( $gateway->get_description() ),
			'needsHostedFields' => in_array( $gateway->id, $hosted, true ),
		);
	}

	return rest_ensure_response( $out );
}

/**
 * Point WooCommerce's checkout page at /secure-checkout, leaving /checkout for
 * the app. Runs on theme activation and whenever WooCommerce is first detected.
 */
add_action( 'after_switch_theme', 'lunamoon_setup_checkout_page', 20 );
add_action( 'woocommerce_init', 'lunamoon_maybe_setup_checkout_page' );

/**
 * Run the checkout-page setup once, the first time WooCommerce is available.
 */
function lunamoon_maybe_setup_checkout_page() {
	if ( get_option( 'lunamoon_checkout_page_ready' ) ) {
		return;
	}
	lunamoon_setup_checkout_page();
}

/**
 * Create (or move) WooCommerce's checkout page to the secure-checkout slug.
 */
function lunamoon_setup_checkout_page() {
	if ( ! lunamoon_has_woo() ) {
		return;
	}

	$slug     = lunamoon_secure_checkout_slug();
	$existing = get_page_by_path( $slug );

	if ( $existing ) {
		$page_id = $existing->ID;
	} else {
		// Reuse Woo's existing checkout page if it has one, so saved orders and
		// gateway return URLs keep resolving; otherwise create a new page.
		$current = (int) get_option( 'woocommerce_checkout_page_id' );
		if ( $current && get_post( $current ) ) {
			wp_update_post(
				array(
					'ID'        => $current,
					'post_name' => $slug,
				)
			);
			$page_id = $current;
		} else {
			$page_id = wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => __( 'Secure Checkout', 'lunamoon' ),
					'post_name'    => $slug,
					'post_content' => '<!-- wp:shortcode -->[woocommerce_checkout]<!-- /wp:shortcode -->',
				)
			);
		}
	}

	if ( $page_id && ! is_wp_error( $page_id ) ) {
		update_option( 'woocommerce_checkout_page_id', $page_id );
		update_option( 'lunamoon_checkout_page_ready', 1 );
		flush_rewrite_rules();
	}
}
