<?php
/**
 * Editable content: post types, meta, and the lunamoon/v1 read endpoints.
 *
 * The React app never talks to core's /wp/v2 routes. It reads these instead,
 * which return flat, render-ready shapes (resolved image URLs, prices already in
 * minor units, category names inline) so the front end does no reshaping and
 * makes one request per view.
 *
 * @package LunaMoon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Treatments, testimonials and FAQs.
 */
add_action( 'init', 'lunamoon_register_content' );
function lunamoon_register_content() {
	register_post_type(
		'treatment',
		array(
			'labels'        => array(
				'name'               => __( 'Treatments', 'lunamoon' ),
				'singular_name'      => __( 'Treatment', 'lunamoon' ),
				'add_new_item'       => __( 'Add New Treatment', 'lunamoon' ),
				'edit_item'          => __( 'Edit Treatment', 'lunamoon' ),
				'search_items'       => __( 'Search Treatments', 'lunamoon' ),
			),
			'public'        => true,
			// The React router owns /treatments/<slug>, so WordPress only needs
			// the URL to resolve (index.php serves the app for every route).
			'rewrite'       => array( 'slug' => 'treatments' ),
			'has_archive'   => false,
			'menu_icon'     => 'dashicons-heart',
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
			'show_in_rest'  => true,
			'hierarchical'  => false,
		)
	);

	register_taxonomy(
		'treatment_category',
		'treatment',
		array(
			'labels'       => array(
				'name'          => __( 'Treatment Categories', 'lunamoon' ),
				'singular_name' => __( 'Treatment Category', 'lunamoon' ),
			),
			'public'       => true,
			'hierarchical' => true,
			'show_in_rest' => true,
			'rewrite'      => array( 'slug' => 'treatment-category' ),
		)
	);

	register_post_type(
		'testimonial',
		array(
			'labels'       => array(
				'name'          => __( 'Testimonials', 'lunamoon' ),
				'singular_name' => __( 'Testimonial', 'lunamoon' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'menu_icon'    => 'dashicons-format-quote',
			'supports'     => array( 'title', 'editor', 'page-attributes' ),
			'show_in_rest' => true,
		)
	);

	register_post_type(
		'faq',
		array(
			'labels'       => array(
				'name'          => __( 'FAQs', 'lunamoon' ),
				'singular_name' => __( 'FAQ', 'lunamoon' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'menu_icon'    => 'dashicons-editor-help',
			'supports'     => array( 'title', 'editor', 'page-attributes' ),
			'show_in_rest' => true,
		)
	);

	lunamoon_register_meta();
}

/**
 * Post meta, exposed to REST so it can also be edited in the block editor.
 */
function lunamoon_register_meta() {
	$string = array(
		'type'              => 'string',
		'single'            => true,
		'show_in_rest'      => true,
		'sanitize_callback' => 'sanitize_text_field',
		// Meta is only writable by users who can edit the post it belongs to.
		'auth_callback'     => static function () {
			return current_user_can( 'edit_posts' );
		},
	);

	// Stored as a decimal string ("120.00") because that's what an editor types;
	// the REST response converts it to minor units for the front end.
	register_post_meta( 'treatment', 'lunamoon_price_from', $string );
	register_post_meta( 'treatment', 'lunamoon_duration', $string );
	register_post_meta( 'treatment', 'lunamoon_booking_url', array_merge( $string, array( 'sanitize_callback' => 'esc_url_raw' ) ) );
	register_post_meta(
		'treatment',
		'lunamoon_product_id',
		array_merge( $string, array( 'type' => 'integer', 'sanitize_callback' => 'absint' ) )
	);

	register_post_meta( 'testimonial', 'lunamoon_author', $string );
	register_post_meta( 'testimonial', 'lunamoon_treatment', $string );
	register_post_meta(
		'testimonial',
		'lunamoon_rating',
		array_merge( $string, array( 'type' => 'integer', 'sanitize_callback' => 'absint' ) )
	);
}

/**
 * Convert an editor-entered price ("120", "120.50", "£120") to minor units.
 *
 * Returns null for an empty value, which the front end renders as
 * "on consultation" rather than "£0".
 *
 * @param string $value Raw meta value.
 * @return int|null
 */
function lunamoon_price_to_minor( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return null;
	}
	// Strip everything but digits, separators and a leading minus.
	$clean = preg_replace( '/[^0-9.,\-]/', '', $value );
	if ( '' === $clean ) {
		return null;
	}
	// Treat a comma as the decimal separator only when no dot is present.
	if ( false === strpos( $clean, '.' ) ) {
		$clean = str_replace( ',', '.', $clean );
	} else {
		$clean = str_replace( ',', '', $clean );
	}
	$decimals = lunamoon_has_woo() ? wc_get_price_decimals() : 2;
	return (int) round( (float) $clean * pow( 10, $decimals ) );
}

/**
 * Shape a treatment post for the REST response.
 *
 * @param WP_Post $post Treatment post.
 * @return array
 */
function lunamoon_shape_treatment( $post ) {
	$terms = get_the_terms( $post, 'treatment_category' );
	$terms = is_array( $terms ) ? $terms : array();

	$product_id = (int) get_post_meta( $post->ID, 'lunamoon_product_id', true );

	return array(
		'id'         => $post->ID,
		'slug'       => $post->post_name,
		'title'      => get_the_title( $post ),
		'summary'    => wp_strip_all_tags( get_the_excerpt( $post ) ),
		// Sanitised here so the front end can render it as trusted HTML.
		'content'    => wp_kses_post( apply_filters( 'the_content', $post->post_content ) ),
		'image'      => (string) get_the_post_thumbnail_url( $post, 'large' ),
		'categories' => array_map(
			static function ( $term ) {
				return array(
					'slug' => $term->slug,
					'name' => $term->name,
				);
			},
			array_values( $terms )
		),
		'priceFrom'  => lunamoon_price_to_minor( get_post_meta( $post->ID, 'lunamoon_price_from', true ) ),
		'duration'   => (string) get_post_meta( $post->ID, 'lunamoon_duration', true ),
		'productId'  => $product_id > 0 ? $product_id : null,
		'bookingUrl' => (string) get_post_meta( $post->ID, 'lunamoon_booking_url', true ),
	);
}

/**
 * Register the read-only content routes.
 */
add_action( 'rest_api_init', 'lunamoon_register_content_routes' );
function lunamoon_register_content_routes() {
	$public = '__return_true'; // Published content; no authentication required.

	register_rest_route(
		'lunamoon/v1',
		'/treatments',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => $public,
			'callback'            => 'lunamoon_rest_treatments',
			'args'                => array(
				'category' => array( 'sanitize_callback' => 'sanitize_title' ),
				'per_page' => array(
					'sanitize_callback' => 'absint',
					'default'           => 50,
				),
			),
		)
	);

	register_rest_route(
		'lunamoon/v1',
		'/treatments/(?P<slug>[a-zA-Z0-9\-_%]+)',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => $public,
			'callback'            => 'lunamoon_rest_treatment',
		)
	);

	register_rest_route(
		'lunamoon/v1',
		'/treatment-categories',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => $public,
			'callback'            => 'lunamoon_rest_treatment_categories',
		)
	);

	register_rest_route(
		'lunamoon/v1',
		'/testimonials',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => $public,
			'callback'            => 'lunamoon_rest_testimonials',
			'args'                => array(
				'per_page' => array(
					'sanitize_callback' => 'absint',
					'default'           => 12,
				),
			),
		)
	);

	register_rest_route(
		'lunamoon/v1',
		'/faqs',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => $public,
			'callback'            => 'lunamoon_rest_faqs',
		)
	);

	register_rest_route(
		'lunamoon/v1',
		'/page/(?P<slug>[a-zA-Z0-9\-_%]+)',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => $public,
			'callback'            => 'lunamoon_rest_page',
		)
	);
}

/**
 * GET /lunamoon/v1/treatments
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function lunamoon_rest_treatments( WP_REST_Request $request ) {
	$args = array(
		'post_type'      => 'treatment',
		'post_status'    => 'publish',
		'posts_per_page' => min( 100, max( 1, (int) $request->get_param( 'per_page' ) ) ),
		'orderby'        => array(
			'menu_order' => 'ASC',
			'title'      => 'ASC',
		),
		'no_found_rows'  => true,
	);

	$category = $request->get_param( 'category' );
	if ( $category ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'treatment_category',
				'field'    => 'slug',
				'terms'    => $category,
			),
		);
	}

	$posts = get_posts( $args );

	return rest_ensure_response( array_map( 'lunamoon_shape_treatment', $posts ) );
}

/**
 * GET /lunamoon/v1/treatments/<slug>
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function lunamoon_rest_treatment( WP_REST_Request $request ) {
	$posts = get_posts(
		array(
			'post_type'      => 'treatment',
			'post_status'    => 'publish',
			'name'           => sanitize_title( $request['slug'] ),
			'posts_per_page' => 1,
			'no_found_rows'  => true,
		)
	);

	if ( empty( $posts ) ) {
		return new WP_Error( 'lunamoon_not_found', __( 'Treatment not found.', 'lunamoon' ), array( 'status' => 404 ) );
	}

	return rest_ensure_response( lunamoon_shape_treatment( $posts[0] ) );
}

/**
 * GET /lunamoon/v1/treatment-categories
 *
 * @return WP_REST_Response
 */
function lunamoon_rest_treatment_categories() {
	$terms = get_terms(
		array(
			'taxonomy'   => 'treatment_category',
			'hide_empty' => true,
		)
	);

	if ( is_wp_error( $terms ) ) {
		return rest_ensure_response( array() );
	}

	return rest_ensure_response(
		array_map(
			static function ( $term ) {
				return array(
					'slug'        => $term->slug,
					'name'        => $term->name,
					'description' => $term->description,
					'count'       => (int) $term->count,
				);
			},
			array_values( $terms )
		)
	);
}

/**
 * GET /lunamoon/v1/testimonials
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function lunamoon_rest_testimonials( WP_REST_Request $request ) {
	$posts = get_posts(
		array(
			'post_type'      => 'testimonial',
			'post_status'    => 'publish',
			'posts_per_page' => min( 50, max( 1, (int) $request->get_param( 'per_page' ) ) ),
			'orderby'        => array(
				'menu_order' => 'ASC',
				'date'       => 'DESC',
			),
			'no_found_rows'  => true,
		)
	);

	return rest_ensure_response(
		array_map(
			static function ( $post ) {
				$rating = (int) get_post_meta( $post->ID, 'lunamoon_rating', true );
				return array(
					'id'        => $post->ID,
					'author'    => (string) get_post_meta( $post->ID, 'lunamoon_author', true ) ?: get_the_title( $post ),
					'quote'     => wp_strip_all_tags( $post->post_content ),
					'rating'    => $rating > 0 ? min( 5, $rating ) : 5,
					'treatment' => (string) get_post_meta( $post->ID, 'lunamoon_treatment', true ),
				);
			},
			$posts
		)
	);
}

/**
 * GET /lunamoon/v1/faqs
 *
 * @return WP_REST_Response
 */
function lunamoon_rest_faqs() {
	$posts = get_posts(
		array(
			'post_type'      => 'faq',
			'post_status'    => 'publish',
			'posts_per_page' => 100,
			'orderby'        => array(
				'menu_order' => 'ASC',
				'title'      => 'ASC',
			),
			'no_found_rows'  => true,
		)
	);

	return rest_ensure_response(
		array_map(
			static function ( $post ) {
				return array(
					'id'       => $post->ID,
					'question' => get_the_title( $post ),
					'answer'   => wp_kses_post( apply_filters( 'the_content', $post->post_content ) ),
					'category' => '',
				);
			},
			$posts
		)
	);
}

/**
 * GET /lunamoon/v1/page/<slug>
 *
 * Powers the policy pages, which are edited in wp-admin so a legal correction
 * doesn't need a rebuild.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function lunamoon_rest_page( WP_REST_Request $request ) {
	$page = get_page_by_path( sanitize_title( $request['slug'] ) );

	if ( ! $page || 'publish' !== $page->post_status ) {
		return new WP_Error( 'lunamoon_not_found', __( 'Page not found.', 'lunamoon' ), array( 'status' => 404 ) );
	}

	return rest_ensure_response(
		array(
			'slug'    => $page->post_name,
			'title'   => get_the_title( $page ),
			'content' => wp_kses_post( apply_filters( 'the_content', $page->post_content ) ),
			'updated' => get_post_modified_time( 'c', true, $page ),
		)
	);
}
