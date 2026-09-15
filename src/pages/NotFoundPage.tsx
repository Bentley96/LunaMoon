import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="section-padding">
      <div className="container-prose flex flex-col items-center gap-5 text-center">
        <span className="font-display text-7xl text-blush-300">404</span>
        <h1 className="text-4xl">We couldn't find that page</h1>
        <p className="text-ink-600">
          It may have moved, or the link might be out of date.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Back to the homepage
          </Link>
          <Link to="/treatments" className="btn-outline-ink">
            Browse treatments
          </Link>
        </div>
      </div>
    </section>
  );
}
