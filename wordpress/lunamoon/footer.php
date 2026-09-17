<?php
/**
 * Site footer for the pages WooCommerce renders itself.
 *
 * The PHP twin of src/components/Footer.tsx — same columns, same details, so a
 * visitor who reaches checkout doesn't feel handed to another site.
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
$lunamoon_phone   = lunamoon_detail( 'phone' );
$lunamoon_email   = lunamoon_detail( 'email' );
$lunamoon_hours   = lunamoon_hours();
$lunamoon_dist    = get_template_directory_uri() . '/dist/';
$lunamoon_about   = __( 'Luna Moon LTD provides a range of high-quality aesthetic treatments in Preston. We are fully trained, qualified and insured to guarantee peace of mind. For more information or to make a booking please get in touch.', 'lunamoon' );
?>
<footer class="bg-ink-950 text-ink-200">
	<div class="container-xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-7">
			<div class="lg:col-span-2">
				<a href="<?php echo lunamoon_url( '/' ); ?>" class="inline-block">
					<img src="<?php echo esc_url( $lunamoon_dist . 'images/luna-moon-logo-light.svg' ); ?>"
					     alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" class="h-24 w-auto">
				</a>

				<p class="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
					<?php echo esc_html( get_bloginfo( 'description' ) ); ?>
				</p>
				<p class="mt-3 max-w-sm text-sm leading-relaxed text-ink-400"><?php echo esc_html( $lunamoon_about ); ?></p>

				<div class="mt-6 space-y-2.5 text-sm">
					<?php if ( $lunamoon_address ) : ?>
						<p><?php echo esc_html( implode( ', ', $lunamoon_address ) ); ?></p>
					<?php endif; ?>
					<?php if ( $lunamoon_phone ) : ?>
						<p>
							<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $lunamoon_phone ) ); ?>"
							   class="hover:text-white"><?php echo esc_html( $lunamoon_phone ); ?></a>
						</p>
					<?php endif; ?>
					<?php if ( $lunamoon_email ) : ?>
						<p>
							<a href="mailto:<?php echo esc_attr( $lunamoon_email ); ?>"
							   class="hover:text-white"><?php echo esc_html( $lunamoon_email ); ?></a>
						</p>
					<?php endif; ?>
				</div>

				<div class="mt-6 flex items-center gap-3">
					<img src="<?php echo esc_url( $lunamoon_dist . 'images/klarna-badge.webp' ); ?>"
					     alt="" aria-hidden="true" width="280" height="120" class="h-7 w-auto">
					<p class="text-sm text-ink-300"><?php esc_html_e( 'Pay monthly with Klarna', 'lunamoon' ); ?></p>
				</div>
			</div>

			<?php foreach ( lunamoon_footer_menus() as $lunamoon_heading => $lunamoon_links ) : ?>
				<nav aria-label="<?php echo esc_attr( $lunamoon_heading ); ?>">
					<h2 class="font-display text-lg text-white"><?php echo esc_html( $lunamoon_heading ); ?></h2>
					<ul class="mt-4 space-y-2.5 text-sm">
						<?php foreach ( $lunamoon_links as $lunamoon_link ) : ?>
							<li>
								<a href="<?php echo lunamoon_url( $lunamoon_link['url'] ); ?>"
								   class="text-ink-300 transition-colors hover:text-white">
									<?php echo esc_html( $lunamoon_link['label'] ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				</nav>
			<?php endforeach; ?>

			<?php if ( $lunamoon_hours ) : ?>
				<div class="lg:col-span-2">
					<h2 class="font-display text-lg uppercase tracking-wide text-white">
						<?php esc_html_e( 'Opening hours', 'lunamoon' ); ?>
					</h2>
					<dl class="mt-4 space-y-2.5 text-sm">
						<?php foreach ( $lunamoon_hours as $lunamoon_day => $lunamoon_time ) : ?>
							<div class="flex items-center gap-2.5">
								<dt class="text-ink-200"><?php echo esc_html( $lunamoon_day ); ?>:</dt>
								<dd class="text-white"><?php echo esc_html( $lunamoon_time ); ?></dd>
							</div>
						<?php endforeach; ?>
					</dl>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div class="border-t border-ink-800">
		<div class="container-xl flex flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ink-400 sm:flex-row sm:px-6 lg:px-8">
			<p>
				<?php
				/* translators: %1$s: year, %2$s: company name. */
				printf( esc_html__( '© %1$s %2$s. All rights reserved.', 'lunamoon' ), esc_html( gmdate( 'Y' ) ), esc_html__( 'Luna Moon LTD', 'lunamoon' ) );
				?>
			</p>
			<p>
				<a href="<?php echo lunamoon_url( '/clinic-policy' ); ?>" class="hover:text-white">
					<?php esc_html_e( 'Clinic Policy', 'lunamoon' ); ?>
				</a>
				<span class="mx-2">·</span>
				<a href="<?php echo lunamoon_url( '/privacy-policy' ); ?>" class="hover:text-white">
					<?php esc_html_e( 'Privacy', 'lunamoon' ); ?>
				</a>
			</p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
