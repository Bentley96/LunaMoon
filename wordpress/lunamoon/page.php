<?php
/**
 * Template for the pages WordPress renders itself.
 *
 * In practice that means WooCommerce's checkout and account pages: every other
 * front-end URL is forced back to index.php (the app shell) by
 * inc/commerce.php, so this template is what the hand-off lands on.
 *
 * Without it those pages fell through to index.php, which prints an empty
 * #root and never calls the_content() — so the checkout shortcode rendered
 * nothing at all and the app, which has no /checkout route, showed its 404.
 *
 * @package LunaMoon
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main class="lm-main">
	<?php while ( have_posts() ) : ?>
		<?php the_post(); ?>

		<div class="lm-title-band">
			<div class="lm-wrap">
				<h1 class="lm-title"><?php the_title(); ?></h1>
			</div>
		</div>

		<div class="lm-wrap lm-content">
			<div class="lunamoon-woo">
				<?php
				// On checkout and My Account, a page built with Elementor (or
				// Divi, or WPBakery) is rendered as the WooCommerce shortcode
				// alone, without the builder's layout. Everywhere else, and on
				// a page that was never built with one, this is the page's own
				// content as usual.
				if ( ! function_exists( 'lunamoon_woo_page_content' ) || ! lunamoon_woo_page_content() ) {
					the_content();
				}
				?>
			</div>
		</div>
	<?php endwhile; ?>
</main>

<?php
get_footer();
