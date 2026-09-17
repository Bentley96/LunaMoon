<?php
/**
 * Site header for the pages WooCommerce renders itself.
 *
 * Checkout and My Account are WooCommerce's, not the app's, so they can't use
 * the React header — but they shouldn't look like a different website either.
 * This is the same chrome in PHP: the contact bar, the brand bar, the menu.
 *
 * It is deliberately the simpler version. The dropdown is a <details> element
 * and the mobile menu is another, so this carries no JavaScript of its own —
 * on a checkout page, nothing should compete with the payment form for the
 * things that can go wrong.
 *
 * The classes are the app's own Tailwind classes; tailwind.config.js includes
 * this folder so they're compiled into the same stylesheet.
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
<body <?php body_class( 'bg-white text-ink-900 font-sans antialiased' ); ?>>
<?php wp_body_open(); ?>

<header data-site-header class="relative z-40">
	<div class="bg-ink-850 text-white">
		<div class="container-xl flex items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6 lg:px-8">
			<div class="flex flex-wrap items-center gap-x-5 gap-y-1">
				<?php if ( $lunamoon_phone ) : ?>
					<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $lunamoon_phone ) ); ?>"
					   class="font-medium transition-colors hover:text-blush-300">
						<?php echo esc_html( $lunamoon_phone ); ?>
					</a>
				<?php endif; ?>
				<?php if ( $lunamoon_email ) : ?>
					<a href="mailto:<?php echo esc_attr( $lunamoon_email ); ?>"
					   class="hidden transition-colors hover:text-blush-300 sm:inline">
						<?php echo esc_html( $lunamoon_email ); ?>
					</a>
				<?php endif; ?>
			</div>

			<a href="<?php echo lunamoon_url( '/cart' ); ?>" class="transition-colors hover:text-blush-300">
				<?php esc_html_e( 'Basket', 'lunamoon' ); ?>
			</a>
		</div>
	</div>

	<div class="bg-blush-400">
		<div class="container-xl flex items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
			<a href="<?php echo lunamoon_url( '/' ); ?>" class="shrink-0"
			   aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) . __( ' — home', 'lunamoon' ) ); ?>">
				<img src="<?php echo esc_url( $lunamoon_dist . 'images/luna-moon-logo.svg' ); ?>"
				     alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
				     class="h-14 w-auto sm:h-20">
			</a>

			<nav class="hidden items-center gap-1 lg:flex" aria-label="<?php esc_attr_e( 'Main', 'lunamoon' ); ?>">
				<?php foreach ( $lunamoon_menu as $item ) : ?>
					<?php if ( ! empty( $item['children'] ) ) : ?>
						<details class="group relative">
							<summary class="flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink-800 transition-colors hover:text-blush-900">
								<?php echo esc_html( $item['label'] ); ?>
								<span aria-hidden="true" class="text-xs">&#9662;</span>
							</summary>
							<div class="absolute left-0 top-full z-50 w-72 overflow-hidden rounded-xl border border-ink-100 bg-white py-2 shadow-xl">
								<?php foreach ( $item['children'] as $child ) : ?>
									<a href="<?php echo lunamoon_url( $child['url'] ); ?>"
									   class="block px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-blush-50 hover:text-blush-700">
										<?php echo esc_html( $child['label'] ); ?>
									</a>
								<?php endforeach; ?>
							</div>
						</details>
					<?php else : ?>
						<a href="<?php echo lunamoon_url( $item['url'] ); ?>"
						   class="rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink-800 transition-colors hover:text-blush-900">
							<?php echo esc_html( $item['label'] ); ?>
						</a>
					<?php endif; ?>
				<?php endforeach; ?>
			</nav>

			<a href="<?php echo lunamoon_url( '/book-online' ); ?>" class="btn-dark hidden sm:inline-flex">
				<?php esc_html_e( 'Book now', 'lunamoon' ); ?>
			</a>

			<details class="lg:hidden">
				<summary class="cursor-pointer list-none rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink-800">
					<?php esc_html_e( 'Menu', 'lunamoon' ); ?>
				</summary>
				<div class="absolute inset-x-0 z-50 border-t border-blush-500 bg-blush-400 px-4 py-3 shadow-lg sm:px-6">
					<?php foreach ( $lunamoon_menu as $item ) : ?>
						<?php if ( ! empty( $item['children'] ) ) : ?>
							<p class="px-2 pt-3 text-xs font-semibold uppercase tracking-widest text-ink-700">
								<?php echo esc_html( $item['label'] ); ?>
							</p>
							<?php foreach ( $item['children'] as $child ) : ?>
								<a href="<?php echo lunamoon_url( $child['url'] ); ?>"
								   class="block rounded-lg px-2 py-2 text-sm text-ink-800 hover:bg-white/40">
									<?php echo esc_html( $child['label'] ); ?>
								</a>
							<?php endforeach; ?>
						<?php else : ?>
							<a href="<?php echo lunamoon_url( $item['url'] ); ?>"
							   class="block rounded-lg px-2 py-2 text-sm font-semibold uppercase tracking-wide text-ink-800 hover:bg-white/40">
								<?php echo esc_html( $item['label'] ); ?>
							</a>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</details>
		</div>
	</div>
</header>
