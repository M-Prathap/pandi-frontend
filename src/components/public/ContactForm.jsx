import { useState } from 'react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function ContactForm({ ctaText }) {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', message: 'Thank you — your message has been received. We will respond within 24 hours.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Could not send message. Please try again or reach out directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status.type === 'success') {
    return (
      <div className="contact-success-card">
        <div className="success-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2>Message Received</h2>
        <p className="success-msg">{status.message}</p>
        <button
          type="button"
          className="btn-accent btn-accent--solid"
          onClick={() => setStatus({ type: '', message: '' })}
          style={{ marginTop: '1.25rem' }}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="contact-experience">
      {/* Quick Direct Studio Contact Pills */}
      <div className="contact-quick-cards">
        {settings.contactEmail && (
          <a href={`mailto:${settings.contactEmail}`} className="contact-quick-card">
            <span className="quick-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <div className="quick-card-content">
              <span className="quick-card-label">Email Us</span>
              <span className="quick-card-value">{settings.contactEmail}</span>
            </div>
          </a>
        )}

        {settings.contactPhone && (
          <a href={`tel:${settings.contactPhone}`} className="contact-quick-card">
            <span className="quick-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div className="quick-card-content">
              <span className="quick-card-label">Direct Line</span>
              <span className="quick-card-value">{settings.contactPhone}</span>
            </div>
          </a>
        )}

        <div className="contact-quick-card studio-location">
          <span className="quick-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div className="quick-card-content">
            <span className="quick-card-label">Studio & Craft</span>
            <span className="quick-card-value">Packaging Prepress & Branding</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Form */}
      <form className="contact-form modern-form" onSubmit={onSubmit}>
        <div className="form-fields-grid">
          <label className="field-group">
            <span className="field-label">Your Name <span className="req">*</span></span>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              required
              autoComplete="name"
              placeholder="e.g. John Doe"
            />
          </label>

          <label className="field-group">
            <span className="field-label">Email Address <span className="req">*</span></span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
              placeholder="john@example.com"
            />
          </label>

          <label className="field-group full-width">
            <span className="field-label">Subject / Project Scope</span>
            <input
              name="subject"
              type="text"
              value={form.subject}
              onChange={onChange}
              placeholder="e.g. Luxury Box Packaging & Label Identity"
            />
          </label>

          <label className="field-group full-width">
            <span className="field-label">Project Details <span className="req">*</span></span>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              required
              rows={5}
              placeholder="Tell us about your brand, packaging goals, volume, or timeline…"
            />
          </label>
        </div>

        {status.type === 'error' && (
          <div className="contact-error-alert" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{status.message}</span>
          </div>
        )}

        <div className="form-submit-row">
          <button
            type="submit"
            className="btn-accent btn-accent--solid contact-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-dot" />
                <span>Sending inquiry…</span>
              </>
            ) : (
              <>
                <span>{ctaText || 'Send Message'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
