import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { business } from '../config/site';

/**
 * Landing page after a successful Store API order.
 *
 * Deliberately minimal: WooCommerce emails the real receipt, and the order id
 * alone shouldn't be enough to display order contents to whoever opens the URL.
 */
export default function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const orderId = params.get('order');

  return (
    <section className="section-padding">
      <div className="container-prose flex flex-col items-center gap-5 text-center">
        <CheckCircle2 className="h-14 w-14 text-blush-600" aria-hidden="true" />
        <h1 className="text-4xl">Thank you for your order</h1>
        {orderId && (
          <p className="text-ink-600">
            Your order number is <strong className="text-ink-900">#{orderId}</strong>.
          </p>
        )}
        <p className="max-w-lg leading-relaxed text-ink-600">
          We've emailed your confirmation. If anything looks wrong, get in touch and we'll sort it.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            Continue shopping
          </Link>
          {business.phone && (
            <a href={`tel:${business.phoneHref || business.phone}`} className="btn-outline-ink">
              Call {business.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
