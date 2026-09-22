<?php
/**
 * Luna Moon Aesthetics theme functions.
 *
 * A hybrid headless theme. The front end is a React app built with Vite;
 * WordPress and WooCommerce own the data and expose it over REST:
 *
 *   inc/bootstrap.php  Injects window.__LUNAMOON__ (REST root, nonce, currency,
 *                      contact details) so the app renders correctly on first paint.
 *   inc/content.php    Treatment / testimonial / FAQ post types and the
 *                      lunamoon/v1 content endpoints the app reads.
 *   inc/commerce.php   WooCommerce support, Store API plumbing, payment methods.
 *   inc/enquiry.php    Booking-enquiry endpoint, lead storage and wp_mail() delivery.
 *   inc/admin.php      Editor meta boxes for the fields the app reads.
 *
 * Everything the app renders comes from WordPress, so the clinic can change
 * treatments, prices, products and policy copy in wp-admin without a rebuild.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LUNAMOON_VERSION', '1.0.0' );

require get_template_directory() . '/inc/bootstrap.php';
require get_template_directory() . '/inc/content.php';
require get_template_directory() . '/inc/commerce.php';
require get_template_directory() . '/inc/enquiry.php';
require get_template_directory() . '/inc/admin.php';
require get_template_directory() . '/inc/seo.php';

/**
 * Front-end routes handled by React Router.
 *
 * A WordPress page is created for each on activation so deep links resolve with
 * an HTTP 200 and a correct <title> — important for SEO and for link previews,
 * which never run the JS. Keys are page slugs; values are page titles.
 * 'home' becomes the static front page.
 *
 * WooCommerce creates its own cart/checkout pages, so they are not listed here.
 *
 * @return array<string,string>
 */
function lunamoon_routes() {
	return array(
		'home'                            => __( 'Home', 'lunamoon' ),
		'book-online'                     => __( 'Book Online', 'lunamoon' ),
		'products'                        => __( 'Products', 'lunamoon' ),
		'advanced-facial-treatments'      => __( 'Advanced Facial Treatments', 'lunamoon' ),
		'laser-cosmetic-teeth-whitening'  => __( 'Laser Cosmetic Teeth Whitening', 'lunamoon' ),
		'skin-tightening-weight-loss'     => __( 'Body Contouring & Skin Tightening', 'lunamoon' ),
		'faqs'                            => __( 'FAQs', 'lunamoon' ),
		'contact'                         => __( 'Contact', 'lunamoon' ),
		'clinic-policy'                   => __( 'Clinic Policy', 'lunamoon' ),
		'privacy-policy'                  => __( 'Privacy Policy', 'lunamoon' ),
	);
}

/**
 * The main menu, for the PHP-rendered pages.
 *
 * WooCommerce renders checkout and account itself, so those pages get the
 * header and footer from header.php / footer.php rather than from React. This
 * is the same menu as src/config/site.ts — kept in step by hand, which is the
 * price of the two pages the app doesn't own. It changes about once a year.
 *
 * @return array<int,array{label:string,url:string,children?:array}>
 */
function lunamoon_menu() {
	return apply_filters(
		'lunamoon_menu',
		array(
			array( 'label' => __( 'Home', 'lunamoon' ), 'url' => '/' ),
			array( 'label' => __( 'Book Online', 'lunamoon' ), 'url' => '/book-online' ),
			array( 'label' => __( 'Products', 'lunamoon' ), 'url' => '/products' ),
			array(
				'label'    => __( 'Our Treatments', 'lunamoon' ),
				'url'      => '#',
				'children' => array(
					array( 'label' => __( 'Advanced Facial Treatments', 'lunamoon' ), 'url' => '/advanced-facial-treatments' ),
					array( 'label' => __( 'Laser Cosmetic Teeth Whitening', 'lunamoon' ), 'url' => '/laser-cosmetic-teeth-whitening' ),
					array( 'label' => __( 'Body Contouring & Skin Tightening', 'lunamoon' ), 'url' => '/skin-tightening-weight-loss' ),
					array( 'label' => __( 'IPL Laser Hair Removal', 'lunamoon' ), 'url' => '/book-online#ipl-laser-hair-removal' ),
				),
			),
			array( 'label' => __( 'FAQ’s', 'lunamoon' ), 'url' => '/faqs' ),
			array( 'label' => __( 'Contact', 'lunamoon' ), 'url' => '/contact' ),
		)
	);
}

/**
 * Footer link columns, mirroring src/config/site.ts.
 *
 * @return array<string,array<int,array{label:string,url:string}>>
 */
function lunamoon_footer_menus() {
	$treatments = array();
	foreach ( lunamoon_menu() as $item ) {
		if ( ! empty( $item['children'] ) ) {
			$treatments = $item['children'];
			break;
		}
	}

	return apply_filters(
		'lunamoon_footer_menus',
		array(
			__( 'Our Treatments', 'lunamoon' ) => $treatments,
			__( 'Shop', 'lunamoon' )           => array(
				array( 'label' => __( 'All products', 'lunamoon' ), 'url' => '/products' ),
				array( 'label' => __( 'Basket', 'lunamoon' ), 'url' => '/cart' ),
			),
			__( 'Clinic', 'lunamoon' )         => array(
				array( 'label' => __( 'Book Online', 'lunamoon' ), 'url' => '/book-online' ),
				array( 'label' => __( 'FAQ’s', 'lunamoon' ), 'url' => '/faqs' ),
				array( 'label' => __( 'Contact', 'lunamoon' ), 'url' => '/contact' ),
				array( 'label' => __( 'Clinic Policy', 'lunamoon' ), 'url' => '/clinic-policy' ),
			),
		)
	);
}

/**
 * A site URL for one of the app's routes.
 *
 * @param string $path Route path, e.g. "/book-online".
 * @return string
 */
function lunamoon_url( $path ) {
	return esc_url( home_url( $path ) );
}

/**
 * Basic theme support.
 */
add_action( 'after_setup_theme', 'lunamoon_setup' );
function lunamoon_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'style', 'script' ) );
	add_theme_support( 'customize-selective-refresh-widgets' );
	load_theme_textdomain( 'lunamoon', get_template_directory() . '/languages' );
}

/**
 * Read the Vite build manifest (maps source entry -> hashed output files).
 *
 * @return array
 */
function lunamoon_manifest() {
	static $manifest = null;
	if ( null !== $manifest ) {
		return $manifest;
	}
	$dist = get_template_directory() . '/dist/';
	// Prefer a non-dot manifest (dot-folders like .vite are frequently dropped
	// when zipping on Windows or extracting on some hosts); fall back to Vite's
	// default .vite/manifest.json.
	$paths    = array( $dist . 'manifest.json', $dist . '.vite/manifest.json' );
	$manifest = array();
	foreach ( $paths as $path ) {
		if ( file_exists( $path ) ) {
			$decoded  = json_decode( file_get_contents( $path ), true );
			$manifest = is_array( $decoded ) ? $decoded : array();
			break;
		}
	}
	return $manifest;
}

/**
 * Find the entry chunk in the manifest (keyed by src/main.tsx, or whichever
 * chunk is flagged isEntry as a fallback).
 *
 * @return array|null
 */
function lunamoon_entry() {
	$manifest = lunamoon_manifest();
	if ( isset( $manifest['src/main.tsx'] ) ) {
		return $manifest['src/main.tsx'];
	}
	foreach ( $manifest as $chunk ) {
		if ( ! empty( $chunk['isEntry'] ) ) {
			return $chunk;
		}
	}
	return null;
}

/**
 * Resolve the built entry JS + CSS files, relative to /dist/.
 *
 * Uses the Vite manifest when available, and otherwise locates the hashed entry
 * files directly in dist/assets (main-*.js / main-*.css). The fallback keeps the
 * site working even if the manifest didn't make it onto the server. The entry's
 * lazy chunks load themselves at runtime, so only the entry JS and its CSS need
 * enqueuing.
 *
 * @return array{ js:string, css:string[] }
 */
function lunamoon_entry_files() {
	$entry = lunamoon_entry();
	if ( $entry && ! empty( $entry['file'] ) ) {
		return array(
			'js'  => $entry['file'],
			'css' => ! empty( $entry['css'] ) ? (array) $entry['css'] : array(),
		);
	}

	$assets_dir = get_template_directory() . '/dist/assets/';
	$js         = glob( $assets_dir . 'main-*.js' );
	$css        = glob( $assets_dir . 'main-*.css' );
	if ( $js ) {
		return array(
			'js'  => 'assets/' . basename( $js[0] ),
			'css' => $css ? array( 'assets/' . basename( $css[0] ) ) : array(),
		);
	}

	return array(
		'js'  => '',
		'css' => array(),
	);
}

/**
 * Enqueue the built React app (ES module) and its CSS.
 */
add_action( 'wp_enqueue_scripts', 'lunamoon_enqueue_app' );
function lunamoon_enqueue_app() {
	$style     = get_template_directory() . '/style.css';
	$style_ver = file_exists( $style ) ? filemtime( $style ) : null;

	// Checkout and My Account are rendered by WooCommerce through page.php, not
	// by the app. They get WooCommerce's stylesheet and this theme's, and
	// nothing else: the app has no #root to mount into there, and its CSS
	// carries Tailwind's preflight, which would strip the defaults out of
	// WooCommerce's own markup for no gain.
	if ( function_exists( 'lunamoon_is_woo_owned_request' ) && lunamoon_is_woo_owned_request() ) {
		wp_enqueue_style( 'lunamoon-theme', get_stylesheet_uri(), array(), $style_ver );
		return;
	}

	$files = lunamoon_entry_files();
	if ( '' === $files['js'] ) {
		return; // Not built / files not present.
	}

	$dist_uri = get_template_directory_uri() . '/dist/';
	$dist_dir = get_template_directory() . '/dist/';

	foreach ( $files['css'] as $i => $css ) {
		$ver = file_exists( $dist_dir . $css ) ? filemtime( $dist_dir . $css ) : null;
		wp_enqueue_style( 'lunamoon-app-' . $i, $dist_uri . $css, array(), $ver );
	}

	// The theme's own stylesheet last, so it can override the app's — it holds
	// the WordPress-specific tweaks the build knows nothing about, the admin
	// bar offset among them.
	wp_enqueue_style(
		'lunamoon-theme',
		get_stylesheet_uri(),
		array_map(
			static function ( $i ) {
				return 'lunamoon-app-' . $i;
			},
			array_keys( $files['css'] )
		),
		$style_ver
	);

	$ver = file_exists( $dist_dir . $files['js'] ) ? filemtime( $dist_dir . $files['js'] ) : null;
	wp_enqueue_script( 'lunamoon-app', $dist_uri . $files['js'], array(), $ver, true );
}

/**
 * Page-builder and old-theme CSS, off the pages WooCommerce renders.
 *
 * Checkout and My Account are built by this theme and WooCommerce, not by
 * Elementor or a JetPlugins widget, but those stylesheets still load site-wide
 * and bring rules broad enough to reach anything on the page — a heading, an
 * image. There's nothing on these two pages for them to style, so they come
 * off: the page gets lighter and the cascade gets predictable.
 *
 * Deliberately narrow: a payment gateway's own CSS is left alone, because
 * that's what draws the card fields.
 */
add_action( 'wp_enqueue_scripts', 'lunamoon_dequeue_builder_styles', 100 );
function lunamoon_dequeue_builder_styles() {
	if ( ! function_exists( 'lunamoon_is_woo_owned_request' ) || ! lunamoon_is_woo_owned_request() ) {
		return;
	}

	$styles = wp_styles();
	if ( ! $styles || empty( $styles->queue ) ) {
		return;
	}

	$drop = apply_filters( 'lunamoon_dequeue_style_prefixes', array( 'elementor', 'jet-', 'eael-', 'e-animation', 'widget-' ) );

	foreach ( (array) $styles->queue as $handle ) {
		foreach ( $drop as $prefix ) {
			if ( 0 === strpos( $handle, $prefix ) ) {
				wp_dequeue_style( $handle );
				break;
			}
		}
	}
}

/**
 * The few rules on those pages that must not lose.
 *
 * Printed last in <head>, after every plugin stylesheet, and marked important.
 * That isn't how a theme should normally get its way, but a live WordPress
 * carries CSS this theme has never seen — the first version of these templates
 * reached the clinic's install with a 700px logo because something else on the
 * page won the argument about image heights. The rest of the styling is in
 * style.css as ordinary rules; this is only the handful that decide whether the
 * page is usable.
 */
add_action( 'wp_head', 'lunamoon_critical_css', 999 );
function lunamoon_critical_css() {
	if ( ! function_exists( 'lunamoon_is_woo_owned_request' ) || ! lunamoon_is_woo_owned_request() ) {
		return;
	}
	?>
<style id="lunamoon-critical">
.lm-page .lm-logo{height:3.5rem!important;width:auto!important;max-width:none!important;display:block!important}
@media (min-width:640px){.lm-page .lm-logo{height:5rem!important}}
.lm-page .lm-footer-logo{height:6rem!important;width:auto!important;max-width:none!important}
.lm-page .lm-klarna img{height:1.75rem!important;width:auto!important}
.lm-page .lm-title{font-family:"Cormorant Garamond",Georgia,serif!important;font-size:2rem!important;color:#1c1817!important;text-align:left!important;text-transform:uppercase!important;letter-spacing:-.01em!important;margin:0!important}
@media (min-width:640px){.lm-page .lm-title{font-size:2.5rem!important}}
.lm-page .lm-contact{background:#201d1c!important;color:#fff!important}
.lm-page .lm-brand{background:#e4c3ba!important}
.lm-page .lm-footer{background:#110e0d!important;color:#d9cfcb!important}
.lm-page .lm-wrap{max-width:80rem!important;margin-left:auto!important;margin-right:auto!important}
.lm-page .lunamoon-woo .elementor-section,.lm-page .lunamoon-woo .elementor-container,.lm-page .lunamoon-woo .elementor-column,.lm-page .lunamoon-woo .elementor-column-wrap,.lm-page .lunamoon-woo .elementor-widget-wrap,.lm-page .lunamoon-woo .e-con,.lm-page .lunamoon-woo .e-con-inner,.lm-page .lunamoon-woo .et_pb_section,.lm-page .lunamoon-woo .et_pb_row,.lm-page .lunamoon-woo .vc_row{margin:0!important;padding:0!important;min-height:0!important}
</style>
	<?php
}

/**
 * Load the entry as a native ES module (Vite output requires type="module").
 *
 * The `?ver=` query is stripped deliberately: the entry's lazy-loaded chunks
 * import the entry back by its plain filename (no query), so if WordPress served
 * the entry as `main.js?ver=123` the browser would load it a SECOND time as
 * `main.js` — two module instances, two copies of React, and hooks would fail
 * with "dispatcher is null" on every lazy page. Vite's content hash in the
 * filename already busts caches, so no version query is needed.
 */
add_filter( 'script_loader_tag', 'lunamoon_module_script', 10, 3 );
function lunamoon_module_script( $tag, $handle, $src ) {
	if ( 'lunamoon-app' === $handle ) {
		$src = remove_query_arg( 'ver', $src );
		return '<script type="module" crossorigin src="' . esc_url( $src ) . '"></script>' . "\n";
	}
	return $tag;
}

/**
 * Trim WordPress front-end cruft the app doesn't use (emoji detection script).
 */
add_action( 'init', 'lunamoon_trim_frontend' );
function lunamoon_trim_frontend() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
}

/**
 * Warn in wp-admin if the front end hasn't been built yet.
 */
add_action( 'admin_notices', 'lunamoon_build_notice' );
function lunamoon_build_notice() {
	if ( '' !== lunamoon_entry_files()['js'] ) {
		return;
	}
	echo '<div class="notice notice-warning"><p><strong>' . esc_html__( 'Luna Moon theme:', 'lunamoon' ) . '</strong> '
		. esc_html__( 'the front-end app was not found. Make sure the dist folder (including dist/assets) was uploaded into the theme.', 'lunamoon' )
		. '</p></div>';
}

/**
 * On theme activation, create a page for each React route, set the static front
 * page, and flush permalinks.
 */
add_action( 'after_switch_theme', 'lunamoon_scaffold_pages' );
function lunamoon_scaffold_pages() {
	$home_id = 0;

	foreach ( lunamoon_routes() as $slug => $title ) {
		$existing = get_page_by_path( $slug );
		if ( $existing ) {
			$page_id = $existing->ID;
		} else {
			$page_id = wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => $title,
					'post_name'    => $slug,
					'post_content' => '',
				)
			);
		}
		if ( 'home' === $slug && $page_id && ! is_wp_error( $page_id ) ) {
			$home_id = $page_id;
		}
	}

	if ( $home_id ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_id );
	}

	// Pretty permalinks are required for the route slugs to resolve.
	if ( '' === get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}
	flush_rewrite_rules();
}
