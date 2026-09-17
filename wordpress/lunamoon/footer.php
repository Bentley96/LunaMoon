<?php
/**
 * Site footer for the pages WooCommerce renders itself.
 *
 * The PHP twin of src/components/Footer.tsx — same columns, same details, so a
 * visitor who reaches checkout doesn't feel handed to another site. Styled from
 * style.css rather than the app's compiled classes; see header.php.
 *
 * @package LunaMoon
 */

defined( 'ABSPATH' ) || exit;

$lunamoon_address = array_values(
	array_filter(
		array_map( 'trim', preg_split( '/\r\n|\r|\n/', lunamoon_detail( 'address' ) ) ),
		static function ( $line ) {
			return '' !== $line;
		}
	)
);
$lunamoon_phone = lunamoon_detail( 'phone' );
$lunamoon_email = lunamoon_detail( 'email' );
$lunamoon_hours = lunamoon_hours();
$lunamoon_dist  = get_template_directory_uri() . '/dist/';
$lunamoon_about = __( 'Luna Moon LTD provides a range of high-quality aesthetic treatments in Preston. We are fully trained, qualified and insured to guarantee peace of mind. For more information or to make a booking please get in touch.', 'lunamoon' );
?>
<footer class="lm-footer">
	<div class="lm-wrap">
		<div class="lm-footer-grid">
			<div class="lm-footer-wide">
				<a href="<?php echo lunamoon_url( '/' ); ?>">
					<img class="lm-footer-logo"
					     src="<?php echo esc_url( $lunamoon_dist . 'images/luna-moon-logo-light.svg' ); ?>"
					     alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
					     width="320" height="160">
				</a>

				<p class="lm-footer-tagline"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
				<p class="lm-footer-about"><?php echo esc_html( $lunamoon_about ); ?></p>

				<div class="lm-footer-details">
					<?php if ( $lunamoon_address ) : ?>
						<p><?php echo esc_html( implode( ', ', $lunamoon_address ) ); ?></p>
					<?php endif; ?>
					<?php if ( $lunamoon_phone ) : ?>
						<p>
							<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $lunamoon_phone ) ); ?>">
								<?php echo esc_html( $lunamoon_phone ); ?>
							</a>
						</p>
					<?php endif; ?>
					<?php if ( $lunamoon_email ) : ?>
						<p>
							<a href="mailto:<?php echo esc_attr( $lunamoon_email ); ?>">
								<?php echo esc_html( $lunamoon_email ); ?>
							</a>
						</p>
					<?php endif; ?>
				</div>

				<div class="lm-klarna">
					<img src="<?php echo esc_url( $lunamoon_dist . 'images/klarna-badge.webp' ); ?>"
					     alt="" aria-hidden="true" width="280" height="120">
					<p><?php esc_html_e( 'Pay monthly with Klarna', 'lunamoon' ); ?></p>
				</div>
			</div>

			<?php foreach ( lunamoon_footer_menus() as $lunamoon_heading => $lunamoon_links ) : ?>
				<nav aria-label="<?php echo esc_attr( $lunamoon_heading ); ?>">
					<h2><?php echo esc_html( $lunamoon_heading ); ?></h2>
					<ul>
						<?php foreach ( $lunamoon_links as $lunamoon_link ) : ?>
							<li>
								<a href="<?php echo lunamoon_url( $lunamoon_link['url'] ); ?>">
									<?php echo esc_html( $lunamoon_link['label'] ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				</nav>
			<?php endforeach; ?>

			<?php if ( $lunamoon_hours ) : ?>
				<div class="lm-footer-wide">
					<h2><?php esc_html_e( 'Opening hours', 'lunamoon' ); ?></h2>
					<dl class="lm-hours">
						<?php foreach ( $lunamoon_hours as $lunamoon_day => $lunamoon_time ) : ?>
							<div>
								<dt><?php echo esc_html( $lunamoon_day ); ?>:</dt>
								<dd><?php echo esc_html( $lunamoon_time ); ?></dd>
							</div>
						<?php endforeach; ?>
					</dl>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div class="lm-footer-bottom">
		<div class="lm-wrap">
			<p>
				<?php
				/* translators: %1$s: year, %2$s: company name. */
				printf( esc_html__( '© %1$s %2$s. All rights reserved.', 'lunamoon' ), esc_html( gmdate( 'Y' ) ), esc_html__( 'Luna Moon LTD', 'lunamoon' ) );
				?>
			</p>
			<p>
				<a href="<?php echo lunamoon_url( '/clinic-policy' ); ?>"><?php esc_html_e( 'Clinic Policy', 'lunamoon' ); ?></a>
				<span>·</span>
				<a href="<?php echo lunamoon_url( '/privacy-policy' ); ?>"><?php esc_html_e( 'Privacy', 'lunamoon' ); ?></a>
			</p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
