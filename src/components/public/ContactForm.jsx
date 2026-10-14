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
      setStatus({ type: 'success', message: 'Thanks — your message was sent.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Could not send message. Try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status.type === 'success') {
    return (
      <div className="form-success">
        <h2>Message sent</h2>
        <p>{status.message}</p>
      </div>
    );
  }

  return (
    <>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required autoComplete="name" />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Subject
          <input name="subject" value={form.subject} onChange={onChange} />
        </label>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={onChange} required />
        </label>
        {status.type === 'error' && <p className="contact-note">{status.message}</p>}
        <button type="submit" className="btn-accent btn-accent--solid" disabled={submitting}>
          {submitting ? 'Sending…' : ctaText || 'Send message'}
        </button>
      </form>
      {(settings.contactEmail || settings.contactPhone) && (
        <p className="contact-note">
          Or reach us at{' '}
          {settings.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          )}
          {settings.contactEmail && settings.contactPhone ? ' · ' : ''}
          {settings.contactPhone}
        </p>
      )}
    </>
  );
}
