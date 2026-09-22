<?php
/**
 * Booking enquiries: REST endpoint, lead storage and email delivery.
 *
 * Leads are stored as a private post type first and emailed second, so a
 * submission is never lost to a mail failure.
 *
 * Recipients and keys are configured with constants in wp-config.php rather
 * than hard-coded here — nothing site-specific belongs in version control.
 *
 *   define( 'LUNAMOON_ENQUIRY_TO', 'hello@example.co.uk' );
 *   define( 'LUNAMOON_ENQUIRY_CC', 'someone@example.co.uk' );   // optional, comma-separated
 *   define( 'LUNAMOON_FROM_EMAIL', 'noreply@example.co.uk' );
 *   define( 'LUNAMOON_FROM_NAME', 'Luna Moon Aesthetics' );
 *   define( 'LUNAMOON_RECAPTCHA_SECRET', '...' );               // optional
 *
 * @package LunaMoon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Where enquiries are emailed. Falls back to the site admin address.
 *
 * @return string
 */
function lunamoon_enquiry_to() {
	return defined( 'LUNAMOON_ENQUIRY_TO' ) && LUNAMOON_ENQUIRY_TO
		? LUNAMOON_ENQUIRY_TO
		: get_option( 'admin_email' );
}

/**
 * Optional Cc recipients.
 *
 * @return string[]
 */
function lunamoon_enquiry_cc() {
	if ( ! defined( 'LUNAMOON_ENQUIRY_CC' ) || ! LUNAMOON_ENQUIRY_CC ) {
		return array();
	}
	return array_filter( array_map( 'trim', explode( ',', LUNAMOON_ENQUIRY_CC ) ) );
}

/**
 * From address for notification emails.
 *
 * @return string
 */
function lunamoon_from_email() {
	if ( defined( 'LUNAMOON_FROM_EMAIL' ) && LUNAMOON_FROM_EMAIL ) {
		return LUNAMOON_FROM_EMAIL;
	}
	// A From address on the site's own domain keeps SPF/DKIM alignment intact.
	$host = wp_parse_url( home_url(), PHP_URL_HOST );
	return 'noreply@' . preg_replace( '/^www\./', '', (string) $host );
}

/**
 * From name for notification emails.
 *
 * @return string
 */
function lunamoon_from_name() {
	return defined( 'LUNAMOON_FROM_NAME' ) && LUNAMOON_FROM_NAME
		? LUNAMOON_FROM_NAME
		: get_bloginfo( 'name' );
}

/**
 * reCAPTCHA v3 secret. Unset means "honeypot only".
 *
 * @return string
 */
function lunamoon_recaptcha_secret() {
	return defined( 'LUNAMOON_RECAPTCHA_SECRET' ) ? LUNAMOON_RECAPTCHA_SECRET : '';
}

/**
 * Minimum reCAPTCHA v3 score to accept (0.0-1.0). 0.5 is Google's default.
 *
 * @return float
 */
function lunamoon_recaptcha_min_score() {
	return (float) apply_filters( 'lunamoon_recaptcha_min_score', 0.5 );
}

/**
 * Store leads in wp-admin so nothing is lost if an email fails.
 */
add_action( 'init', 'lunamoon_register_enquiry_cpt' );
function lunamoon_register_enquiry_cpt() {
	register_post_type(
		'lunamoon_enquiry',
		array(
			'labels'          => array(
				'name'          => __( 'Enquiries', 'lunamoon' ),
				'singular_name' => __( 'Enquiry', 'lunamoon' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_icon'       => 'dashicons-email',
			'supports'        => array( 'title', 'editor' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
}

/**
 * Anti-spam gate: a honeypot field plus reCAPTCHA v3.
 *
 * @param array $params Request params.
 * @return true|WP_Error True to proceed, or a WP_Error to reject.
 */
function lunamoon_spam_gate( $params ) {
	// Honeypot: a hidden "website" field that real users never fill in.
	if ( ! empty( $params['website'] ) ) {
		return new WP_Error( 'lunamoon_spam', __( 'Submission rejected.', 'lunamoon' ), array( 'status' => 400 ) );
	}

	$secret = lunamoon_recaptcha_secret();
	if ( ! $secret ) {
		return true; // reCAPTCHA not configured — honeypot only.
	}

	$token = isset( $params['recaptcha_token'] ) ? sanitize_text_field( $params['recaptcha_token'] ) : '';
	if ( '' === $token ) {
		return new WP_Error( 'lunamoon_recaptcha', __( 'Verification failed. Please reload the page and try again.', 'lunamoon' ), array( 'status' => 400 ) );
	}

	$resp = wp_remote_post(
		'https://www.google.com/recaptcha/api/siteverify',
		array(
			'timeout' => 10,
			'body'    => array(
				'secret'   => $secret,
				'response' => $token,
			),
		)
	);

	// Fail open on a transport error so genuine users aren't blocked if Google
	// is briefly unreachable; the honeypot still applies.
	if ( is_wp_error( $resp ) ) {
		return true;
	}

	$data  = json_decode( wp_remote_retrieve_body( $resp ), true );
	$score = isset( $data['score'] ) ? (float) $data['score'] : 0.0;
	if ( empty( $data['success'] ) || $score < lunamoon_recaptcha_min_score() ) {
		return new WP_Error( 'lunamoon_recaptcha', __( 'We could not verify your submission. Please try again.', 'lunamoon' ), array( 'status' => 400 ) );
	}

	return true;
}

/**
 * Register the enquiry route the booking forms POST to.
 */
add_action( 'rest_api_init', 'lunamoon_register_enquiry_route' );
function lunamoon_register_enquiry_route() {
	register_rest_route(
		'lunamoon/v1',
		'/enquiry',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			// Public by design: this is the site's contact form. Spam is handled
			// by the honeypot + reCAPTCHA gate, not by authentication.
			'permission_callback' => '__return_true',
			'callback'            => 'lunamoon_handle_enquiry',
		)
	);
}

/**
 * POST /lunamoon/v1/enquiry
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function lunamoon_handle_enquiry( WP_REST_Request $request ) {
	$params = $request->get_json_params();
	if ( ! is_array( $params ) ) {
		$params = $request->get_params();
	}

	$gate = lunamoon_spam_gate( $params );
	if ( is_wp_error( $gate ) ) {
		return $gate;
	}

	$name      = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';
	$phone     = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
	$email     = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
	$treatment = isset( $params['treatment'] ) ? sanitize_text_field( $params['treatment'] ) : '';
	$message   = isset( $params['message'] ) ? sanitize_textarea_field( $params['message'] ) : '';

	if ( '' === $name || '' === $phone || ! is_email( $email ) ) {
		return new WP_Error(
			'lunamoon_invalid',
			__( 'Please provide your name, phone number and a valid email address.', 'lunamoon' ),
			array( 'status' => 400 )
		);
	}

	// Store the lead before attempting delivery.
	$stored = wp_insert_post(
		array(
			'post_type'    => 'lunamoon_enquiry',
			'post_status'  => 'private',
			/* translators: 1: treatment name, 2: enquirer name */
			'post_title'   => sprintf( __( '%1$s: %2$s', 'lunamoon' ), $treatment ? $treatment : __( 'General enquiry', 'lunamoon' ), $name ),
			'post_content' => $message,
		)
	);

	if ( $stored && ! is_wp_error( $stored ) ) {
		update_post_meta( $stored, 'lunamoon_name', $name );
		update_post_meta( $stored, 'lunamoon_phone', $phone );
		update_post_meta( $stored, 'lunamoon_email', $email );
		update_post_meta( $stored, 'lunamoon_treatment', $treatment );
	}

	$rows  = lunamoon_enquiry_row( __( 'Name', 'lunamoon' ), $name );
	$rows .= lunamoon_enquiry_row( __( 'Phone', 'lunamoon' ), $phone );
	$rows .= lunamoon_enquiry_row( __( 'Email', 'lunamoon' ), $email );
	if ( '' !== $treatment ) {
		$rows .= lunamoon_enquiry_row( __( 'Treatment', 'lunamoon' ), $treatment );
	}
	if ( '' !== $message ) {
		$rows .= lunamoon_enquiry_row( __( 'Message', 'lunamoon' ), $message );
	}

	$body = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">'
		. '<h2 style="color:#1e1729;">' . esc_html__( 'New booking enquiry', 'lunamoon' ) . '</h2>'
		. '<table style="border-collapse:collapse;width:100%;background:#f5f1f8;border-radius:8px;">' . $rows . '</table>'
		. '<p style="color:#6b5185;font-size:12px;margin-top:16px;">'
		. esc_html( sprintf( /* translators: %s: site name */ __( 'Sent automatically from the %s website.', 'lunamoon' ), get_bloginfo( 'name' ) ) )
		. '</p></div>';

	$headers = array(
		'Content-Type: text/html; charset=UTF-8',
		sprintf( 'From: %s <%s>', lunamoon_from_name(), lunamoon_from_email() ),
		sprintf( 'Reply-To: %s <%s>', $name, $email ),
	);
	foreach ( lunamoon_enquiry_cc() as $cc ) {
		$headers[] = 'Cc: ' . $cc;
	}

	$subject = sprintf(
		/* translators: 1: treatment name, 2: enquirer name */
		__( 'New enquiry: %1$s, from %2$s', 'lunamoon' ),
		$treatment ? $treatment : __( 'General', 'lunamoon' ),
		$name
	);

	$sent = wp_mail( lunamoon_enquiry_to(), $subject, $body, $headers );

	if ( ! $sent ) {
		return new WP_Error(
			'lunamoon_mail_failed',
			__( 'Your enquiry was received but we could not send the notification email. Please call us if you do not hear back.', 'lunamoon' ),
			array( 'status' => 502 )
		);
	}

	return new WP_REST_Response( array( 'success' => true ), 200 );
}

/**
 * Render one HTML table row for the notification email.
 *
 * @param string $label Row label.
 * @param string $value Row value.
 * @return string
 */
function lunamoon_enquiry_row( $label, $value ) {
	return '<tr>'
		. '<td style="padding:6px 12px;font-weight:600;color:#1e1729;">' . esc_html( $label ) . '</td>'
		. '<td style="padding:6px 12px;color:#3d2d4f;">' . nl2br( esc_html( $value ) ) . '</td>'
		. '</tr>';
}

/**
 * Show the submitted contact details in the Enquiries list.
 *
 * @param array $columns Existing columns.
 * @return array
 */
add_filter( 'manage_lunamoon_enquiry_posts_columns', 'lunamoon_enquiry_columns' );
function lunamoon_enquiry_columns( $columns ) {
	$date = isset( $columns['date'] ) ? $columns['date'] : '';
	unset( $columns['date'] );

	$columns['lunamoon_phone'] = __( 'Phone', 'lunamoon' );
	$columns['lunamoon_email'] = __( 'Email', 'lunamoon' );
	if ( $date ) {
		$columns['date'] = $date;
	}
	return $columns;
}

/**
 * Populate the custom Enquiries columns.
 *
 * @param string $column  Column key.
 * @param int    $post_id Post id.
 */
add_action( 'manage_lunamoon_enquiry_posts_custom_column', 'lunamoon_enquiry_column_content', 10, 2 );
function lunamoon_enquiry_column_content( $column, $post_id ) {
	if ( 'lunamoon_phone' === $column ) {
		echo esc_html( get_post_meta( $post_id, 'lunamoon_phone', true ) );
	} elseif ( 'lunamoon_email' === $column ) {
		$email = get_post_meta( $post_id, 'lunamoon_email', true );
		if ( $email ) {
			echo '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>';
		}
	}
}

/*
 * -----------------------------------------------------------------------------
 * Mail transport
 * -----------------------------------------------------------------------------
 *
 * wp_mail() above is transport-agnostic. Pick ONE:
 *
 * OPTION A — a plugin (recommended). Install "WP Mail SMTP", "Mailgun for
 *   WordPress", or similar, and configure it in wp-admin. Every wp_mail() call
 *   routes through it with no code change.
 *
 * OPTION B — SMTP from wp-config.php. Define the constants below and uncomment
 *   the hook:
 *     define( 'LUNAMOON_SMTP_HOST', 'smtp.example.com' );
 *     define( 'LUNAMOON_SMTP_PORT', 587 );
 *     define( 'LUNAMOON_SMTP_SECURE', 'tls' );   // 'tls' or 'ssl'
 *     define( 'LUNAMOON_SMTP_USER', 'smtp-user' );
 *     define( 'LUNAMOON_SMTP_PASS', 'smtp-password' );
 */

// add_action( 'phpmailer_init', 'lunamoon_configure_smtp' );
/**
 * Point PHPMailer at an SMTP server defined in wp-config.php.
 *
 * @param PHPMailer $phpmailer PHPMailer instance.
 */
function lunamoon_configure_smtp( $phpmailer ) {
	if ( ! defined( 'LUNAMOON_SMTP_HOST' ) ) {
		return;
	}
	$phpmailer->isSMTP();
	$phpmailer->Host       = LUNAMOON_SMTP_HOST;
	$phpmailer->Port       = defined( 'LUNAMOON_SMTP_PORT' ) ? LUNAMOON_SMTP_PORT : 587;
	$phpmailer->SMTPSecure = defined( 'LUNAMOON_SMTP_SECURE' ) ? LUNAMOON_SMTP_SECURE : 'tls';
	if ( defined( 'LUNAMOON_SMTP_USER' ) && defined( 'LUNAMOON_SMTP_PASS' ) ) {
		$phpmailer->SMTPAuth = true;
		$phpmailer->Username = LUNAMOON_SMTP_USER;
		$phpmailer->Password = LUNAMOON_SMTP_PASS;
	}
}
