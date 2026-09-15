import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getTreatments } from '../lib/wp';
import { useAsync } from '../hooks/useAsync';
import TreatmentCard from './TreatmentCard';
import SectionHeading from './ui/SectionHeading';
import Spinner from './ui/Spinner';

export default function FeaturedTreatments() {
  const { data, loading, error } = useAsync(() => getTreatments({ limit: 6 }), []);

  if (error || (!loading && (!data || data.length === 0))) return null;

  return (
    <section className="section-padding">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Treatments"
          title="Popular at Luna Moon"
          intro="From subtle refreshers to full skin overhauls — every treatment starts with a proper consultation."
        />

        {loading ? (
          <Spinner label="Loading treatments…" />
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data!.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/treatments" className="btn-outline-ink">
                See all treatments
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
