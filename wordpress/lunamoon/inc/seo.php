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
 * An SEO plugin (Rank Math, Yoast, All in One SEO) overrides all of it, which
 * is the right way round: a plugin means the clinic edits its own titles in
 * wp-admin, page by page, and keeps whatever it had set before the theme
 * changed. These are the fallback for when there isn't one.
 *
 * Overriding the server-rendered head isn't enough on its own, though. The app
 * sets the title again on every client-side route change, and it can only use
 * what it was given, so lunamoon_seo_routes() below hands it the plugin's
 * values for every route. Without that, moving between pages inside the app
 * would put this file's titles back over the plugin's.
 *
 * @package LunaMoon
 */

defined( 'ABSPATH' ) || exit;

/**
 * Which SEO plugin, if any, is managing the head.
 *
 * @return string Plugin key, or '' when the theme is on its own.
 */
function lunamoon_seo_plugin() {
	if ( defined( 'RANK_MATH_VERSION' ) ) {
		return 'rank_math';
	}
	if ( defined( 'WPSEO_VERSION' ) ) {
		return 'yoast';
	}
	if ( defined( 'AIOSEO_VERSION' ) ) {
		return 'aioseo';
	}
	return '';
}

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
	if ( lunamoon_seo_plugin() ) {
		return $parts;
	}

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
	if ( lunamoon_seo_plugin() ) {
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

/**
 * The per-route head values the app should use, with the SEO plugin winning.
 *
 * The app owns every route after the first click: WordPress renders the head
 * once, then React Router moves between pages without another request. So the
 * title and description for *every* route have to be in the page it was given,
 * or the app has nothing to set them from and the landing page's title sticks.
 *
 * Each route is a real WordPress page, and Rank Math, Yoast and All in One SEO
 * all store their per-page title and description as ordinary post meta. That's
 * what this reads. Anything the clinic hasn't filled in falls back to the
 * theme's own wording from dist/seo.json, so a page with nothing set in the
 * plugin still has a sensible title rather than an empty one.
 *
 * @return array<string,array{title:string,description:string,canonical?:string}>
 */
function lunamoon_seo_routes() {
	$plugin   = lunamoon_seo_plugin();
	$fallback = lunamoon_seo_table();

	if ( ! $plugin ) {
		return $fallback;
	}

	// The meta keys each plugin stores its per-page values under.
	$keys = array(
		'rank_math' => array( 'rank_math_title', 'rank_math_description', 'rank_math_canonical_url' ),
		'yoast'     => array( '_yoast_wpseo_title', '_yoast_wpseo_metadesc', '_yoast_wpseo_canonical' ),
		'aioseo'    => array( '_aioseo_title', '_aioseo_description', '_aioseo_canonical_url' ),
	);

	if ( ! isset( $keys[ $plugin ] ) ) {
		return $fallback;
	}

	list( $title_key, $desc_key, $canonical_key ) = $keys[ $plugin ];

	$routes = $fallback;

	foreach ( lunamoon_routes() as $slug => $unused ) {
		$page = 'home' === $slug
			? get_post( (int) get_option( 'page_on_front' ) )
			: get_page_by_path( $slug );

		if ( ! $page ) {
			continue;
		}

		$route = 'home' === $slug ? '/' : '/' . $slug;
		$entry = isset( $routes[ $route ] ) ? $routes[ $route ] : array(
			'title'       => '',
			'description' => '',
		);

		$title = lunamoon_seo_resolve( get_post_meta( $page->ID, $title_key, true ), $page );
		$desc  = lunamoon_seo_resolve( get_post_meta( $page->ID, $desc_key, true ), $page );
		$canon = get_post_meta( $page->ID, $canonical_key, true );

		if ( '' !== $title ) {
			$entry['title'] = $title;
		}
		if ( '' !== $desc ) {
			$entry['description'] = $desc;
		}
		if ( is_string( $canon ) && '' !== $canon ) {
			$entry['canonical'] = $canon;
		}

		$routes[ $route ] = $entry;
	}

	/**
	 * Filter the per-route head values handed to the app.
	 *
	 * @param array  $routes Route path => title/description/canonical.
	 * @param string $plugin Active SEO plugin key.
	 */
	return apply_filters( 'lunamoon_seo_routes', $routes, $plugin );
}

/**
 * Turn a stored template into the string a visitor would see.
 *
 * The plugins let you write titles as templates — "%title% %sep% %sitename%" —
 * and each has its own way of filling them in. Rank Math's is used where it
 * exists; anything still carrying a % afterwards is treated as unresolved and
 * dropped, because a literal %sep% in a browser tab is worse than the theme's
 * own wording.
 *
 * @param mixed   $value Stored meta value.
 * @param WP_Post $post  The page it belongs to.
 * @return string Resolved value, or '' when there isn't a usable one.
 */
function lunamoon_seo_resolve( $value, $post ) {
	if ( ! is_string( $value ) || '' === trim( $value ) ) {
		return '';
	}

	$value = trim( $value );

	if ( is_callable( array( 'RankMath\Helper', 'replace_vars' ) ) ) {
		$value = RankMath\Helper::replace_vars( $value, $post );
	} elseif ( function_exists( 'wpseo_replace_vars' ) ) {
		$value = wpseo_replace_vars( $value, $post );
	}

	if ( false !== strpos( $value, '%' ) ) {
		return '';
	}

	return wp_strip_all_tags( $value );
}
