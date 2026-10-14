import { useEffect, useState } from 'react';
import api, { unwrap } from '../../services/api';
import PageCard from '../../components/public/PageCard';
import ContactForm from '../../components/public/ContactForm';

export default function ContactPage() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/pages/contact');
        if (!cancelled) setPage(unwrap(res));
      } catch {
        if (!cancelled) setPage({ title: 'Contact us', lead: '', body: '', ctaText: 'Send message' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!page) {
    return (
      <PageCard title="Contact" wide>
        <p className="page-card__lead">Loading…</p>
      </PageCard>
    );
  }

  return (
    <PageCard title={page.title} lead={page.lead} bodyHtml={page.body} wide>
      <ContactForm ctaText={page.ctaText} />
    </PageCard>
  );
}
