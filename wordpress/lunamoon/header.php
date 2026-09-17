<?php
/**
 * Site header for the pages WooCommerce renders itself.
 *
 * Checkout and My Account are WooCommerce's, not the app's, so they can't use
 * the React header — but they shouldn't look like a different website either.
 * This is the same chrome in PHP: the contact bar, the brand bar, the menu.
 *
 * It carries no JavaScript. The dropdown and the mobile menu are <details>
 * elements: on a checkout page, nothing should compete with the payment form
 * for the things that can go wrong.
 *
 * The classes are the theme's own (style.css), not the app's compiled Tailwind
 * ones. That stylesheet is served exactly as written, so these pages can't be
 * broken by the build's purge step, a CSS minifier or a caching plugin.
 *
 * @package LunaMoon
 */

defined( 'ABSPATH' ) || exit;

$lunamoon_phone = lunamoon_detail( 'phone' );
$lunamoon_email = lunamoon_detail( 'email' );
$lunamoon_menu  = lunamoon_menu();
$lunamoon_dist  = get_template_directory_uri() . '/dist/';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'lm-page' ); ?>>
<?php wp_body_open(); ?>

<header class="lm-header">
	<div class="lm-contact">
		<div class="lm-wrap">
			<div class="lm-contact-details">
				<?php if ( $lunamoon_phone ) : ?>
					<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $lunamoon_phone ) ); ?>">
						<?php echo esc_html( $lunamoon_phone ); ?>
					</a>
				<?php endif; ?>
				<?php if ( $lunamoon_email ) : ?>
					<a class="lm-contact-email" href="mailto:<?php echo esc_attr( $lunamoon_email ); ?>">
						<?php echo esc_html( $lunamoon_email ); ?>
					</a>
				<?php endif; ?>
			</div>

			<a href="<?php echo lunamoon_url( '/cart' ); ?>"><?php esc_html_e( 'Basket', 'lunamoon' ); ?></a>
		</div>
	</div>

	<div class="lm-brand">
		<div class="lm-wrap">
			<a href="<?php echo lunamoon_url( '/' ); ?>"
			   aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
				<img class="lm-logo"
				     src="<?php echo esc_url( $lunamoon_dist . 'images/luna-moon-logo.svg' ); ?>"
				     alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
				     width="320" height="160">
			</a>

			<nav class="lm-nav" aria-label="<?php esc_attr_e( 'Main', 'lunamoon' ); ?>">
				<?php foreach ( $lunamoon_menu as $lunamoon_item ) : ?>
					<?php if ( ! empty( $lunamoon_item['children'] ) ) : ?>
						<details class="lm-dropdown">
							<summary>
								<?php echo esc_html( $lunamoon_item['label'] ); ?>
								<span aria-hidden="true">&#9662;</span>
							</summary>
							<div class="lm-dropdown-panel">
								<?php foreach ( $lunamoon_item['children'] as $lunamoon_child ) : ?>
									<a href="<?php echo lunamoon_url( $lunamoon_child['url'] ); ?>">
										<?php echo esc_html( $lunamoon_child['label'] ); ?>
									</a>
								<?php endforeach; ?>
							</div>
						</details>
					<?php else : ?>
						<a href="<?php echo lunamoon_url( $lunamoon_item['url'] ); ?>">
							<?php echo esc_html( $lunamoon_item['label'] ); ?>
						</a>
					<?php endif; ?>
				<?php endforeach; ?>
			</nav>

			<a class="lm-btn lm-book" href="<?php echo lunamoon_url( '/book-online' ); ?>">
				<?php esc_html_e( 'Book now', 'lunamoon' ); ?>
			</a>

			<details class="lm-mobile">
				<summary><?php esc_html_e( 'Menu', 'lunamoon' ); ?></summary>
				<div class="lm-mobile-panel">
					<?php foreach ( $lunamoon_menu as $lunamoon_item ) : ?>
						<?php if ( ! empty( $lunamoon_item['children'] ) ) : ?>
							<p class="lm-mobile-group"><?php echo esc_html( $lunamoon_item['label'] ); ?></p>
							<?php foreach ( $lunamoon_item['children'] as $lunamoon_child ) : ?>
								<a href="<?php echo lunamoon_url( $lunamoon_child['url'] ); ?>">
									<?php echo esc_html( $lunamoon_child['label'] ); ?>
								</a>
							<?php endforeach; ?>
						<?php else : ?>
							<a href="<?php echo lunamoon_url( $lunamoon_item['url'] ); ?>">
								<?php echo esc_html( $lunamoon_item['label'] ); ?>
							</a>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</details>
		</div>
	</div>
</header>
