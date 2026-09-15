# Luna Moon Aesthetics — hybrid headless WordPress theme

The front end is a React app (Vite + TypeScript + Tailwind). WordPress and
WooCommerce own the **data** — treatments, products, cart, orders, policy copy —
and serve it over REST. React owns the **rendering**, up to the checkout.

This is "hybrid" rather than fully headless: there's one origin, one deploy, and
no separate Node host. WordPress serves the app shell, so cookies, the REST
nonce and the WooCommerce cart token all behave as same-origin.

```
wordpress/
  README.md                ← this guide
  lunamoon/                ← the theme (deploy to wp-content/themes/lunamoon)
    style.css              ← theme header
    functions.php          ← enqueues the built app, creates route pages
    index.php              ← universal shell: renders <div id="root">
    inc/bootstrap.php      ← injects window.__LUNAMOON__; Customizer fields
    inc/content.php        ← treatment/testimonial/FAQ post types + REST routes
    inc/commerce.php       ← WooCommerce support and URL ownership
    inc/enquiry.php        ← booking-enquiry endpoint, lead storage, wp_mail()
    inc/admin.php          ← editor meta boxes
    dist/                  ← build output (committed, so the theme deploys
                             without a build step on the server)
```

---

## How it works

**Serving the app.** `npm run build` compiles React into `lunamoon/dist/`.
`functions.php` reads the build manifest and enqueues the hashed entry as an ES
module. `index.php` renders an empty `#root`; React Router picks the page from
the URL. Because it's `index.php` it is WordPress's fallback for every route.

**Assets resolve at runtime.** Lazy chunks use a relative base, and image paths
(`/images/...`) are rewritten at build time to read from
`window.__LUNAMOON_DIST__`. So the deployed theme folder can be named anything,
and subdirectory installs work, without rebuilding.

**First paint has data.** `inc/bootstrap.php` prints `window.__LUNAMOON__` into
`<head>` — REST root, REST nonce, currency settings, and the clinic's contact
details — so the header and footer render correctly with no round-trip.

**Content comes from WordPress.** The app reads the theme's own `lunamoon/v1`
namespace, which returns flat, render-ready shapes (resolved image URLs, prices
already in minor units, category names inline):

| Route                                   | Returns                                   |
| --------------------------------------- | ----------------------------------------- |
| `GET /lunamoon/v1/treatments`           | Treatments, optionally `?category=<slug>` |
| `GET /lunamoon/v1/treatments/<slug>`    | One treatment                             |
| `GET /lunamoon/v1/treatment-categories` | Categories with counts                    |
| `GET /lunamoon/v1/testimonials`         | Reviews                                   |
| `GET /lunamoon/v1/faqs`                 | FAQs                                      |
| `GET /lunamoon/v1/page/<slug>`          | A WordPress page (policy copy)            |
| `POST /lunamoon/v1/enquiry`             | Booking enquiry (honeypot + reCAPTCHA)    |

**Commerce comes from WooCommerce.** Products and the basket use the **Store
API** (`/wp-json/wc/store/v1`) — WooCommerce's public front-end API. It needs no
consumer key, works logged-out, and keeps stock, tax, shipping, coupons and
orders in WooCommerce where they belong. The client carries the rotating `Nonce`
header and persists the guest `Cart-Token`.

### Who owns which URL

This is the one thing to keep straight:

| URL                                     | Rendered by              |
| --------------------------------------- | ------------------------ |
| `/`, `/treatments/…`, `/about`, `/faqs` | React                    |
| `/shop`, `/shop/<slug>`, `/cart`        | React (Store API)        |
| `/checkout/…`                           | **WooCommerce** (native) |
| `/my-account/…`                         | **WooCommerce** (native) |

React owns browsing and the basket. From the Checkout button onwards it's
WooCommerce — which means every gateway, plugin and tax/shipping rule works out
of the box, with no gateway-specific code to maintain.

`inc/commerce.php` forces `index.php` back for the shop and product URLs that
WooCommerce would otherwise template itself, and leaves checkout and account
URLs alone. The owned paths are read from WooCommerce's own page settings, so
renaming the checkout page in wp-admin is picked up automatically.

**The hand-off works because both sides read the same cart.** The Store API
writes to the visitor's WooCommerce session, and the app's fetches are
same-origin with `credentials: 'same-origin'`, so the session cookie is set and
sent. The basket filled in React is the basket WooCommerce's checkout loads. The
`Cart-Token` header is only a fallback for browsers that drop the cookie — if
you ever move the app to a different origin, that hand-off breaks and checkout
would need the Store API's own checkout endpoint instead.

---

## Deploying

### 1. Build

```bash
npm install
npm run build            # outputs wordpress/lunamoon/dist/
npm run package:theme    # …and zips it to wordpress/lunamoon-theme.zip
```

### 2. Install

**Upload the zip:** wp-admin → Appearance → Themes → Add New → Upload Theme →
Install → Activate.

**Or copy the folder:** copy `wordpress/lunamoon/` (including `dist/`) to
`wp-content/themes/lunamoon/` and activate it.

> `dist/` is required. Without it wp-admin shows a warning and the site renders
> blank.

### 3. Finish setup

1. **Install and activate WooCommerce**, then run its setup wizard.
2. **Settings → Permalinks** → **Post name** → Save. (Activation sets this if
   permalinks were still "Plain", but confirm it.)
3. **Appearance → Customize → Clinic details** — phone, email, address, opening
   hours, social links. These feed the header, footer and contact page.
4. **WooCommerce → Settings → Payments** — enable at least one gateway. Style
   the checkout page to match if you want the transition to feel seamless.
5. Add content: **Treatments**, **Testimonials**, **FAQs**, and **Products**.
6. Fill in the `privacy-policy`, `terms-conditions` and `cancellation-policy`
   pages (activation creates them empty).

### 4. Configure email

Enquiries are sent with `wp_mail()`. Set the recipients in `wp-config.php`:

```php
define( 'LUNAMOON_ENQUIRY_TO', 'hello@aestheticspreston.co.uk' );
define( 'LUNAMOON_ENQUIRY_CC', '' );                    // optional, comma-separated
define( 'LUNAMOON_FROM_EMAIL', 'noreply@aestheticspreston.co.uk' );
define( 'LUNAMOON_FROM_NAME', 'Luna Moon Aesthetics' );
```

Then pick a transport — install *WP Mail SMTP* or *Mailgun for WordPress* and
configure it in wp-admin (no code change), or define the `LUNAMOON_SMTP_*`
constants and uncomment the `phpmailer_init` hook at the bottom of
`inc/enquiry.php`.

Leads are stored as a private `lunamoon_enquiry` post type (menu: **Enquiries**)
**before** the email is attempted, so nothing is lost if mail fails.

### 5. reCAPTCHA (optional)

The forms are protected by a honeypot always, and by reCAPTCHA v3 when
configured. Set the secret in `wp-config.php`:

```php
define( 'LUNAMOON_RECAPTCHA_SECRET', '...' );
```

and build with the matching public site key:

```bash
VITE_RECAPTCHA_SITE_KEY=... npm run build
```

Leave both unset to run honeypot-only.

---

## Local development

```bash
npm run dev              # http://localhost:5173
```

The app runs standalone — content sections with no data simply hide, so no
WordPress is needed to work on layout. To develop against real content, point
the dev server at a WordPress install and `/wp-json` is proxied there:

```bash
WP_ORIGIN=https://staging.aestheticspreston.co.uk npm run dev
```

Useful checks before committing:

```bash
npm run typecheck
npm run lint
```

---

## Day-to-day content changes

Treatments, prices, products, reviews, FAQs, policy copy and the clinic's
contact details are all edited in **wp-admin** and appear immediately — no
rebuild, no redeploy.

A rebuild is only needed for changes to layout, design or navigation, which live
in the React source:

- Brand colours and fonts: `tailwind.config.js`
- Navigation and footer structure: `src/config/site.ts`
- Page layouts: `src/pages/`, `src/components/`

---

## Notes & gotchas

- **Theme folder name.** Assets resolve at runtime, so the deployed folder can
  be named anything without a rebuild.
- **Subdirectory installs.** Handled automatically — `inc/bootstrap.php` sends
  the path as the router `basename`.
- **Page caching.** The bootstrap nonce can go stale on a cached page. Read
  routes are public so they're unaffected, and the Store API rotates its own
  nonce via response headers, so the cart still works.
- **Images.** `public/images/` is currently empty. Drop brand photography in and
  reference it as `/images/...`; until then every image slot renders a branded
  placeholder rather than collapsing the layout.
- **Placeholder copy.** Everything marked `TODO(content)` in `src/` is written
  around what the clinic is known to offer, not copied from the live site. It
  needs replacing before launch.
