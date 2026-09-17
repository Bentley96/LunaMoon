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

<main class="bg-white">
	<?php while ( have_posts() ) : ?>
		<?php the_post(); ?>

		<div class="border-b border-ink-100 bg-blush-50">
			<div class="container-xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
				<h1 class="font-display text-3xl uppercase tracking-tight text-ink-900 sm:text-4xl">
					<?php the_title(); ?>
				</h1>
			</div>
		</div>

		<div class="container-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
			<div class="lunamoon-woo">
				<?php the_content(); ?>
			</div>
		</div>
	<?php endwhile; ?>
</main>

<?php
get_footer();
