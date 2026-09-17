<?php
/**
 * Front-end bootstrap data.
 *
 * Prints a small JSON blob into <head> before the bundle loads so the React app
 * knows the REST root, the REST nonce, the shop's currency and the clinic's
 * contact details on first paint — no round-trip, no flash of an empty header.
 *
 * Contact details are stored as theme mods so they're editable under
 * Appearance -> Customize -> Clinic details without touching code.
 *
 * @package LunaMoon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Default clinic details.
 *
 * These match the defaults in src/config/site.ts, so the PHP-rendered pages and
 * the app say the same thing before anyone opens the Customizer. Setting a
 * value there overrides it.
 *
 * @return array
 */
function lunamoon_default_details() {
	return array(
		'phone'              => '07592 608 064',
		'email'              => 'info@aestheticspreston.co.uk',
		'address'            => "House of Hair & Beauty\n55-56 Friargate\nPreston\nPR1 2AT",
		'hours'              => "Monday|10am - 6pm\nTuesday|10am - 6pm\nWednesday|10am - 5pm\nThursday|10am - 7pm\nFriday|10am - 7pm\nSaturday|10am - 3pm\nSunday|Closed",
		'facebook'           => 'https://www.facebook.com/lunamoonaesthetics',
		'instagram'          => 'https://www.instagram.com/luna_moon_aesthetics__/',
		'tiktok'             => 'https://www.tiktok.com/@luna_moon_aesthetics',
		'whatsapp'           => 'https://wa.me/+447592608064',
		'booking_url'        => 'https://www.that-time.co.uk/luna-moon-aesthetics',
		'google_reviews_url' => '',
		'map_embed_url'      => '',
	);
}

/**
 * Read one clinic detail, falling back to the default above.
 *
 * @param string $key Detail key.
 * @return string
 */
function lunamoon_detail( $key ) {
	$defaults = lunamoon_default_details();
	$value    = get_theme_mod( 'lunamoon_' . $key, isset( $defaults[ $key ] ) ? $defaults[ $key ] : '' );
	return is_string( $value ) ? trim( $value ) : '';
}

/**
 * Parse the opening-hours theme mod into an ordered map.
 *
 * Stored one entry per line as "Label|Value", e.g. "Mon-Fri|9am-7pm", which
 * keeps the Customizer field a simple textarea while still giving the front end
 * structured data to render.
 *
 * @return array<string,string>
 */
function lunamoon_hours() {
	$raw = lunamoon_detail( 'hours' );
	if ( '' === $raw ) {
		return array();
	}
	$hours = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $raw ) as $line ) {
		$line = trim( $line );
		if ( '' === $line || false === strpos( $line, '|' ) ) {
			continue;
		}
		list( $label, $value ) = array_map( 'trim', explode( '|', $line, 2 ) );
		if ( '' !== $label ) {
			$hours[ $label ] = $value;
		}
	}
	return $hours;
}

/**
 * Currency settings, read from WooCommerce when it's active.
 *
 * The Store API returns every amount in minor units plus these separators, so
 * the front end must format with the shop's own settings rather than guessing
 * from the browser locale.
 *
 * @return array
 */
function lunamoon_currency() {
	if ( ! lunamoon_has_woo() ) {
		return array(
			'code'              => 'GBP',
			'symbol'            => '£',
			'minorUnit'         => 2,
			'decimalSeparator'  => '.',
			'thousandSeparator' => ',',
			'prefix'            => '£',
			'suffix'            => '',
		);
	}

	$symbol = html_entity_decode( get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8' );
	$format = get_woocommerce_price_format(); // e.g. '%1$s%2$s'.
	// Split the sprintf format into what sits before and after the amount.
	$parts = explode( '%2$s', str_replace( '%1$s', $symbol, $format ) );

	return array(
		'code'              => get_woocommerce_currency(),
		'symbol'            => $symbol,
		'minorUnit'         => wc_get_price_decimals(),
		'decimalSeparator'  => wc_get_price_decimal_separator(),
		'thousandSeparator' => wc_get_price_thousand_separator(),
		'prefix'            => isset( $parts[0] ) ? $parts[0] : $symbol,
		'suffix'            => isset( $parts[1] ) ? $parts[1] : '',
	);
}

/**
 * Permalinks of the pages WooCommerce renders itself.
 *
 * @return array<string,string>
 */
function lunamoon_woo_urls() {
	if ( ! lunamoon_has_woo() ) {
		return array(
			'checkout'  => '',
			'myAccount' => '',
		);
	}

	return array(
		'checkout'  => esc_url_raw( wc_get_checkout_url() ),
		'myAccount' => esc_url_raw( wc_get_page_permalink( 'myaccount' ) ),
	);
}

/**
 * Router basename — non-empty only when WordPress lives in a subdirectory.
 *
 * @return string
 */
function lunamoon_basename() {
	$path = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	return is_string( $path ) ? rtrim( $path, '/' ) : '';
}

/**
 * Print the bootstrap blob and the asset base.
 *
 * Priority 1 so both are defined before the footer module executes.
 */
add_action( 'wp_head', 'lunamoon_print_bootstrap', 1 );
function lunamoon_print_bootstrap() {
	$address = array_values(
		array_filter(
			array_map( 'trim', preg_split( '/\r\n|\r|\n/', lunamoon_detail( 'address' ) ) ),
			static function ( $line ) {
				return '' !== $line;
			}
		)
	);

	$phone = lunamoon_detail( 'phone' );

	$social = array_filter(
		array(
			'facebook'  => lunamoon_detail( 'facebook' ),
			'instagram' => lunamoon_detail( 'instagram' ),
			'tiktok'    => lunamoon_detail( 'tiktok' ),
			'whatsapp'  => lunamoon_detail( 'whatsapp' ),
		)
	);

	$data = array(
		'restUrl'  => esc_url_raw( rest_url() ),
		// Logged-out visitors on a cached page may receive a stale nonce; the
		// Store API rotates its own via response headers, and the read-only
		// content routes are public, so this is a convenience rather than a
		// dependency.
		'nonce'    => wp_create_nonce( 'wp_rest' ),
		'siteUrl'  => esc_url_raw( home_url( '/' ) ),
		'basename' => lunamoon_basename(),
		'hasWoo'   => lunamoon_has_woo(),
		// WooCommerce renders checkout and account pages itself, so the app
		// needs their real permalinks to hand off to.
		'wooUrls'  => lunamoon_woo_urls(),
		'currency' => lunamoon_currency(),
		'site'     => array(
			'name'             => get_bloginfo( 'name' ),
			'description'      => get_bloginfo( 'description' ),
			'phone'            => $phone,
			'phoneHref'        => preg_replace( '/[^0-9+]/', '', $phone ),
			'email'            => lunamoon_detail( 'email' ),
			'addressLines'     => $address,
			'hours'            => lunamoon_hours(),
			'social'           => $social,
			'bookingUrl'       => lunamoon_detail( 'booking_url' ),
			// Linked from the reviews section so visitors can read the rest.
			'googleReviewsUrl' => lunamoon_detail( 'google_reviews_url' ),
			'mapEmbedUrl'      => lunamoon_detail( 'map_embed_url' ),
		),
	);

	echo '<script>window.__LUNAMOON__=' . wp_json_encode( $data ) . ';'
		. 'window.__LUNAMOON_DIST__=' . wp_json_encode( get_template_directory_uri() . '/dist/' ) . ';</script>' . "\n";
}

/**
 * Customizer panel for the clinic details printed above.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
add_action( 'customize_register', 'lunamoon_customize_details' );
function lunamoon_customize_details( $wp_customize ) {
	$wp_customize->add_section(
		'lunamoon_details',
		array(
			'title'       => __( 'Clinic details', 'lunamoon' ),
			'priority'    => 30,
			'description' => __( 'Shown in the site header, footer and contact page.', 'lunamoon' ),
		)
	);

	$fields = array(
		'phone'              => array( __( 'Phone number', 'lunamoon' ), 'text' ),
		'email'              => array( __( 'Email address', 'lunamoon' ), 'text' ),
		'address'            => array( __( 'Address (one line per row)', 'lunamoon' ), 'textarea' ),
		'hours'              => array( __( 'Opening hours — one per row as "Mon-Fri|9am-7pm"', 'lunamoon' ), 'textarea' ),
		'facebook'           => array( __( 'Facebook URL', 'lunamoon' ), 'url' ),
		'instagram'          => array( __( 'Instagram URL', 'lunamoon' ), 'url' ),
		'tiktok'             => array( __( 'TikTok URL', 'lunamoon' ), 'url' ),
		'whatsapp'           => array( __( 'WhatsApp URL (e.g. https://wa.me/447592608064)', 'lunamoon' ), 'url' ),
		'booking_url'        => array( __( 'External booking URL (optional)', 'lunamoon' ), 'url' ),
		'google_reviews_url' => array( __( 'Google reviews URL (optional) — the listing link from your Google Business Profile', 'lunamoon' ), 'url' ),
		'map_embed_url'      => array( __( 'Map embed URL (optional) — the src from Google Maps → Share → Embed a map', 'lunamoon' ), 'url' ),
	);

	$defaults = lunamoon_default_details();

	foreach ( $fields as $key => $field ) {
		list( $label, $type ) = $field;

		if ( 'url' === $type ) {
			$sanitize = 'esc_url_raw';
		} elseif ( 'textarea' === $type ) {
			$sanitize = 'sanitize_textarea_field';
		} else {
			$sanitize = 'sanitize_text_field';
		}

		$wp_customize->add_setting(
			'lunamoon_' . $key,
			array(
				'default'           => isset( $defaults[ $key ] ) ? $defaults[ $key ] : '',
				'sanitize_callback' => $sanitize,
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			'lunamoon_' . $key,
			array(
				'label'   => $label,
				'section' => 'lunamoon_details',
				'type'    => 'textarea' === $type ? 'textarea' : 'text',
			)
		);
	}
}
