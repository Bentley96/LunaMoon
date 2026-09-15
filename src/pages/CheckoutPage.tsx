import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { formatPrice } from '../lib/format';
import { placeOrder, type CheckoutAddress } from '../lib/woo';
import { getPaymentMethods } from '../lib/checkout';
import { useAsync } from '../hooks/useAsync';
import { bootstrap } from '../lib/bootstrap';
import PageHero from '../components/PageHero';
import Spinner from '../components/ui/Spinner';

const EMPTY_ADDRESS: CheckoutAddress = {
  first_name: '',
  last_name: '',
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'GB',
  email: '',
  phone: '',
};

export default function CheckoutPage() {
  const { cart, loading, refresh } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [note, setNote] = useState('');
  const [method, setMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useAsync(() => getPaymentMethods(), []);

  // Default to the first enabled gateway once they load.
  const selectedMethod = useMemo(() => {
    if (method) return method;
    return methods.data?.[0]?.id ?? '';
  }, [method, methods.data]);

  const set = (field: keyof CheckoutAddress) => (value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!selectedMethod) {
      setError('No payment method is available. Please contact us to complete your order.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await placeOrder({
        billing_address: address,
        // Physical goods ship to the billing address unless the shop is told
        // otherwise; a separate shipping form can be added here later.
        shipping_address: cart?.needs_shipping ? address : undefined,
        customer_note: note,
        payment_method: selectedMethod,
      });

      // Redirect-style gateways (PayPal, hosted Stripe, offline methods with a
      // thank-you page) hand back where to send the browser next.
      const redirect = result.payment_result?.redirect_url;
      if (redirect) {
        window.location.href = redirect;
        return;
      }

      await refresh();
      navigate(`/order-received?order=${result.order_id}&key=${result.order_key}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not place your order.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHero title="Checkout" />
        <Spinner label="Loading checkout…" />
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <PageHero title="Checkout" />
        <section className="section-padding">
          <div className="container-prose text-center">
            <p className="text-lg text-ink-500">There's nothing in your basket yet.</p>
            <Link to="/shop" className="btn-primary mt-6">
              Browse the shop
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero title="Checkout" />

      <section className="section-padding">
        <form onSubmit={onSubmit} className="container-xl grid gap-12 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-10">
            <fieldset>
              <legend className="text-2xl">Your details</legend>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="first_name">First name</label>
                  <input id="first_name" className="field-input" required autoComplete="given-name"
                    value={address.first_name} onChange={(e) => set('first_name')(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="last_name">Last name</label>
                  <input id="last_name" className="field-input" required autoComplete="family-name"
                    value={address.last_name} onChange={(e) => set('last_name')(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="email">Email</label>
                  <input id="email" className="field-input" type="email" required autoComplete="email"
                    value={address.email} onChange={(e) => set('email')(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="phone">Phone</label>
                  <input id="phone" className="field-input" type="tel" autoComplete="tel"
                    value={address.phone} onChange={(e) => set('phone')(e.target.value)} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-2xl">
                {cart.needs_shipping ? 'Delivery address' : 'Billing address'}
              </legend>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="address_1">Address</label>
                  <input id="address_1" className="field-input" required autoComplete="address-line1"
                    value={address.address_1} onChange={(e) => set('address_1')(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="address_2">
                    Address line 2 <span className="font-normal text-ink-400">(optional)</span>
                  </label>
                  <input id="address_2" className="field-input" autoComplete="address-line2"
                    value={address.address_2} onChange={(e) => set('address_2')(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="city">Town / city</label>
                  <input id="city" className="field-input" required autoComplete="address-level2"
                    value={address.city} onChange={(e) => set('city')(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="postcode">Postcode</label>
                  <input id="postcode" className="field-input" required autoComplete="postal-code"
                    value={address.postcode} onChange={(e) => set('postcode')(e.target.value)} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-2xl">Payment</legend>
              {methods.loading ? (
                <Spinner label="Loading payment methods…" />
              ) : methods.data && methods.data.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {methods.data.map((gateway) => (
                    <label
                      key={gateway.id}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                        selectedMethod === gateway.id
                          ? 'border-blush-500 bg-blush-50'
                          : 'border-ink-200 hover:border-ink-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        className="mt-1"
                        value={gateway.id}
                        checked={selectedMethod === gateway.id}
                        onChange={() => setMethod(gateway.id)}
                      />
                      <span>
                        <span className="block font-medium text-ink-900">{gateway.title}</span>
                        {gateway.description && (
                          <span className="mt-1 block text-sm text-ink-500">{gateway.description}</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-600">
                  No payment gateways are enabled in WooCommerce yet. Enable one under
                  <strong> WooCommerce → Settings → Payments</strong>.
                </p>
              )}

              <div className="mt-6">
                <label className="field-label" htmlFor="note">
                  Order notes <span className="font-normal text-ink-400">(optional)</span>
                </label>
                <textarea id="note" className="field-input" rows={3} value={note}
                  onChange={(e) => setNote(e.target.value)} />
              </div>
            </fieldset>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="card p-6">
              <h2 className="text-2xl">Your order</h2>

              <ul className="mt-5 space-y-3 text-sm">
                {cart.items.map((item) => (
                  <li key={item.key} className="flex justify-between gap-4">
                    <span className="text-ink-600">
                      {item.name} <span className="text-ink-400">× {item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(item.totals.line_total, item.totals)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(cart.totals.total_items, cart.totals)}</dd>
                </div>
                {cart.needs_shipping && (
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Shipping</dt>
                    <dd className="font-medium">
                      {cart.totals.total_shipping === null
                        ? '—'
                        : formatPrice(cart.totals.total_shipping, cart.totals)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-ink-100 pt-3 text-lg font-semibold text-ink-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(cart.totals.total_price, cart.totals)}</dd>
                </div>
              </dl>

              {error && (
                <p role="alert" className="mt-5 rounded-lg bg-blush-50 px-4 py-3 text-sm text-blush-800">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary mt-6 w-full" disabled={submitting}>
                <Lock className="h-4 w-4" aria-hidden="true" />
                {submitting ? 'Placing order…' : 'Place order'}
              </button>

              {/* Card gateways that capture details on-page (e.g. Stripe's card
                  element) need WooCommerce's own checkout. This keeps a working
                  route to payment until such a gateway is wired into React. */}
              {bootstrap.siteUrl && (
                <a
                  href={`${bootstrap.siteUrl.replace(/\/$/, '')}/checkout/`}
                  className="btn-ghost mt-3 w-full justify-center text-sm"
                >
                  Use the standard checkout instead
                </a>
              )}
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}
