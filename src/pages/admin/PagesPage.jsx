import { useEffect, useState } from 'react';
import api, { unwrap } from '../../services/api';
import Flash from '../../components/admin/Flash';

const SLUGS = ['about', 'contact'];

export default function PagesPage() {
  const [slug, setSlug] = useState('about');
  const [form, setForm] = useState({ title: '', lead: '', body: '', ctaText: '', ctaLink: '' });
  const [flash, setFlash] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/pages/${slug}`);
        const page = unwrap(res) || {};
        setForm({
          title: page.title || '',
          lead: page.lead || '',
          body: page.body || '',
          ctaText: page.ctaText || '',
          ctaLink: page.ctaLink || '',
        });
      } catch {
        setForm({ title: '', lead: '', body: '', ctaText: '', ctaLink: '' });
      }
    })();
  }, [slug]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/pages/${slug}`, form);
      setFlash(`${slug} page saved`);
    } catch (err) {
      setFlash(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <h1>Pages</h1>
      </div>
      <div className="main">
        <Flash message={flash} onClear={() => setFlash('')} />
        <div className="toolbar">
          <div className="btn-row">
            {SLUGS.map((s) => (
              <button
                key={s}
                type="button"
                className={`btn${slug === s ? ' btn-primary' : ''}`}
                onClick={() => setSlug(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="field">
            Title
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label className="field">
            Lead
            <input
              type="text"
              value={form.lead}
              onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
            />
          </label>
          <label className="field">
            Body (HTML allowed)
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </label>
          {slug === 'contact' && (
            <>
              <label className="field">
                CTA text
                <input
                  type="text"
                  value={form.ctaText}
                  onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
                />
              </label>
              <label className="field">
                CTA link
                <input
                  type="text"
                  value={form.ctaLink}
                  onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                />
              </label>
            </>
          )}
          <div className="btn-row">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save page'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
