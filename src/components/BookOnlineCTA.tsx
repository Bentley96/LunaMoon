import { Link } from 'react-router-dom';
import { bookOnlineCta } from '../content/home';

/** Full-width "BOOK ONLINE" band used at the foot of the content pages. */
export default function BookOnlineCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: 'radial-gradient(55% 80% at 50% 0%, rgba(221,111,135,0.28) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />
      <div className="container-lg relative px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl">{bookOnlineCta.heading}</h2>
        <div className="mx-auto mt-6 max-w-2xl space-y-3 text-lg text-ink-200">
          {bookOnlineCta.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Link to="/book-online" className="btn-primary-lg mt-9">
          Book now
        </Link>
      </div>
    </section>
  );
}
