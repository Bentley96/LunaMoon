<?php
/**
 * Editor UI for the custom fields the React app reads.
 *
 * Registered as classic meta boxes rather than block-editor panels so they work
 * the same way whichever editor the clinic ends up using.
 *
 * @package LunaMoon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Field definitions, keyed by post type.
 *
 * @return array
 */
function lunamoon_meta_fields() {
	return array(
		'treatment'   => array(
			'lunamoon_price_from'  => array( __( 'Price from', 'lunamoon' ), 'text', __( 'e.g. 120 — leave blank to show "On consultation".', 'lunamoon' ) ),
			'lunamoon_duration'    => array( __( 'Duration', 'lunamoon' ), 'text', __( 'e.g. 45 mins', 'lunamoon' ) ),
			'lunamoon_product_id'  => array( __( 'WooCommerce product ID', 'lunamoon' ), 'number', __( 'Optional. Links this treatment to a product so it can be paid for online.', 'lunamoon' ) ),
			'lunamoon_booking_url' => array( __( 'External booking URL', 'lunamoon' ), 'url', __( 'Optional. Used when there is no linked product.', 'lunamoon' ) ),
		),
		'testimonial' => array(
			'lunamoon_author'    => array( __( 'Client name', 'lunamoon' ), 'text', '' ),
			'lunamoon_treatment' => array( __( 'Treatment', 'lunamoon' ), 'text', '' ),
			'lunamoon_rating'    => array( __( 'Rating (1-5)', 'lunamoon' ), 'number', '' ),
		),
	);
}

/**
 * Register the meta boxes.
 */
add_action( 'add_meta_boxes', 'lunamoon_add_meta_boxes' );
function lunamoon_add_meta_boxes() {
	foreach ( array_keys( lunamoon_meta_fields() ) as $post_type ) {
		add_meta_box(
			'lunamoon_details_box',
			__( 'Details', 'lunamoon' ),
			'lunamoon_render_meta_box',
			$post_type,
			'side',
			'default'
		);
	}
}

/**
 * Render the meta box for the current post type.
 *
 * @param WP_Post $post Current post.
 */
function lunamoon_render_meta_box( $post ) {
	$fields = lunamoon_meta_fields();
	if ( ! isset( $fields[ $post->post_type ] ) ) {
		return;
	}

	wp_nonce_field( 'lunamoon_save_meta', 'lunamoon_meta_nonce' );

	foreach ( $fields[ $post->post_type ] as $key => $field ) {
		list( $label, $type, $help ) = $field;
		$value                       = get_post_meta( $post->ID, $key, true );
		printf(
			'<p><label for="%1$s" style="display:block;font-weight:600;margin-bottom:4px;">%2$s</label>'
			. '<input type="%3$s" id="%1$s" name="%1$s" value="%4$s" class="widefat" />%5$s</p>',
			esc_attr( $key ),
			esc_html( $label ),
			esc_attr( $type ),
			esc_attr( $value ),
			$help ? '<span class="description" style="display:block;margin-top:4px;">' . esc_html( $help ) . '</span>' : ''
		);
	}
}

/**
 * Persist the meta box values.
 *
 * @param int $post_id Post id.
 */
add_action( 'save_post', 'lunamoon_save_meta' );
function lunamoon_save_meta( $post_id ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! isset( $_POST['lunamoon_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lunamoon_meta_nonce'] ) ), 'lunamoon_save_meta' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$fields    = lunamoon_meta_fields();
	$post_type = get_post_type( $post_id );
	if ( ! isset( $fields[ $post_type ] ) ) {
		return;
	}

	foreach ( $fields[ $post_type ] as $key => $field ) {
		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}
		$raw = wp_unslash( $_POST[ $key ] );

		if ( 'number' === $field[1] ) {
			$value = absint( $raw );
		} elseif ( 'url' === $field[1] ) {
			$value = esc_url_raw( $raw );
		} else {
			$value = sanitize_text_field( $raw );
		}

		if ( '' === $value || 0 === $value ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $value );
		}
	}
}
