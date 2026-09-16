<?php
/**
 * Page titles and meta descriptions.
 *
 * Every React route is a real WordPress page, so WordPress already prints a
 * <title> — but only the page's name ("Advanced Facial Treatments"), with no
 * description at all. This replaces both with the wording in dist/seo.json,
 * which the app is built from, so the server-rendered head and the title the
 * app sets on a client-side route change can't disagree.
 *
 * This matters because the HTML a crawler or a link preview receives is the
 * theme's, not the app's: neither runs the JS that would otherwise set them.
 *
 * An SEO plugin (Rank Math, Yoast) overrides this, which is the right way
 * round — a plugin means the clinic can edit its own titles. These are the
 * fallback for when there isn't one.
 *
 * @package LunaMoon
 */

defined( 'ABSPATH' ) || exit;

/**
 * Read the per-route title and description table emitted by the build.
 *
 * @return array<string,array{title:string,description:string}>
 */
function lunamoon_seo_table() {
	static $routes = null;
	if ( null !== $routes ) {
		return $routes;
	}

	$routes = array();
	$path   = get_template_directory() . '/dist/seo.json';
	if ( is_readable( $path ) ) {
		$decoded = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( isset( $decoded['routes'] ) && is_array( $decoded['routes'] ) ) {
			$routes = $decoded['routes'];
		}
	}

	return $routes;
}

/**
 * The entry for the page being served, or null.
 *
 * @return array{title:string,description:string}|null
 */
function lunamoon_seo_current() {
	$routes = lunamoon_seo_table();
	if ( ! $routes ) {
		return null;
	}

	if ( is_front_page() ) {
		$key = '/';
	} elseif ( is_page() ) {
		$post = get_post();
		$key  = $post ? '/' . $post->post_name : '';
	} else {
		return null;
	}

	return isset( $routes[ $key ] ) ? $routes[ $key ] : null;
}

/**
 * Replace the page name in <title> with the one from the table.
 *
 * @param array $parts Title parts.
 * @return array
 */
add_filter( 'document_title_parts', 'lunamoon_seo_title' );
function lunamoon_seo_title( $parts ) {
	$meta = lunamoon_seo_current();
	if ( $meta && ! empty( $meta['title'] ) ) {
		$parts['title'] = $meta['title'];
	}
	return $parts;
}

/**
 * Print the description and the Open Graph tags that repeat it.
 *
 * Skipped entirely when an SEO plugin is active, rather than printing a second
 * description tag alongside the plugin's.
 */
add_action( 'wp_head', 'lunamoon_seo_meta', 1 );
function lunamoon_seo_meta() {
	if ( defined( 'RANK_MATH_VERSION' ) || defined( 'WPSEO_VERSION' ) || defined( 'AIOSEO_VERSION' ) ) {
		return;
	}

	$meta = lunamoon_seo_current();
	if ( ! $meta || empty( $meta['description'] ) ) {
		return;
	}

	$description = $meta['description'];
	$title       = wp_get_document_title();

	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $description ) );
	printf( '<meta property="og:type" content="website" />' . "\n" );
	printf( '<meta property="og:title" content="%s" />' . "\n", esc_attr( $title ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $description ) );
	printf( '<meta property="og:url" content="%s" />' . "\n", esc_url( home_url( add_query_arg( array() ) ) ) );
	printf( '<meta property="og:site_name" content="%s" />' . "\n", esc_attr( get_bloginfo( 'name' ) ) );
	printf( '<meta name="twitter:card" content="summary_large_image" />' . "\n" );
}
