import { useEffect, useState } from 'react';
import api, { unwrap } from '../../services/api';
import PageCard from '../../components/public/PageCard';

export default function AboutPage() {
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/pages/about');
        if (!cancelled) setPage(unwrap(res));
      } catch {
        if (!cancelled) setError('Could not load about page.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <PageCard title="About">
        <p>{error}</p>
      </PageCard>
    );
  }

  if (!page) {
    return (
      <PageCard title="About">
        <p className="page-card__lead">Loading…</p>
      </PageCard>
    );
  }

  return <PageCard title={page.title} lead={page.lead} bodyHtml={page.body} />;
}
