import { useEffect, useState } from 'react';
import api, { unwrap } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';
import { useSettings } from '../../context/SettingsContext';
import Dropzone from '../../components/admin/Dropzone';
import Flash from '../../components/admin/Flash';

export default function SettingsPage() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState({
    logoUrl: '',
    brandName: '',
    brandSecondary: '',
    tagline: '',
    footerText: '',
    contactEmail: '',
    contactPhone: '',
    socials: {
      linkedin: '',
      behance: '',
      dribbble: '',
      instagram: '',
      other: '',
    },
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [flash, setFlash] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      logoUrl: settings.logoUrl || '',
      brandName: settings.brandName || '',
      brandSecondary: settings.brandSecondary || '',
      tagline: settings.tagline || '',
      footerText: settings.footerText || '',
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      socials: {
        linkedin: settings.socials?.linkedin || '',
        behance: settings.socials?.behance || '',
        dribbble: settings.socials?.dribbble || '',
        instagram: settings.socials?.instagram || '',
        other: settings.socials?.other || '',
      },
    });
  }, [settings]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const setSocial = (name, value) =>
    setForm((prev) => ({ ...prev, socials: { ...prev.socials, [name]: value } }));

  const onLogoFiles = (files) => {
    const file = files[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = form.logoUrl;
      if (logoFile) {
        const data = new FormData();
        data.append('file', logoFile);
        const res = await api.post('/upload', data);
        logoUrl = unwrap(res).url;
      }
      await api.put('/settings', { ...form, logoUrl });
      setLogoFile(null);
      setLogoPreview('');
      await refresh();
      setFlash('Settings saved');
    } catch (err) {
      setFlash(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const logoSrc = logoPreview || mediaUrl(form.logoUrl) || '/para-logo.svg';

  return (
    <>
      <div className="topbar">
        <h1>Settings</h1>
      </div>
      <div className="main">
        <Flash message={flash} onClear={() => setFlash('')} />
        <form className="form-grid two" onSubmit={onSubmit}>
          <div className="full">
            <p className="muted">Logo</p>
            <img
              src={logoSrc}
              alt=""
              style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: '0.75rem', borderRadius: 12 }}
            />
            <Dropzone onFiles={onLogoFiles} multiple={false} accept="image/*" label="Upload logo" />
          </div>
          <label className="field">
            Brand name
            <input type="text" value={form.brandName} onChange={(e) => setField('brandName', e.target.value)} />
          </label>
          <label className="field">
            Brand secondary
            <input
              type="text"
              value={form.brandSecondary}
              onChange={(e) => setField('brandSecondary', e.target.value)}
            />
          </label>
          <label className="field full">
            Tagline
            <input type="text" value={form.tagline} onChange={(e) => setField('tagline', e.target.value)} />
          </label>
          <label className="field full">
            Footer text
            <input type="text" value={form.footerText} onChange={(e) => setField('footerText', e.target.value)} />
          </label>
          <label className="field">
            Contact email
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setField('contactEmail', e.target.value)}
            />
          </label>
          <label className="field">
            Contact phone
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setField('contactPhone', e.target.value)}
            />
          </label>
          <label className="field">
            LinkedIn
            <input type="url" value={form.socials.linkedin} onChange={(e) => setSocial('linkedin', e.target.value)} />
          </label>
          <label className="field">
            Behance
            <input type="url" value={form.socials.behance} onChange={(e) => setSocial('behance', e.target.value)} />
          </label>
          <label className="field">
            Dribbble
            <input type="url" value={form.socials.dribbble} onChange={(e) => setSocial('dribbble', e.target.value)} />
          </label>
          <label className="field">
            Instagram
            <input type="url" value={form.socials.instagram} onChange={(e) => setSocial('instagram', e.target.value)} />
          </label>
          <label className="field full">
            Other link
            <input type="url" value={form.socials.other} onChange={(e) => setSocial('other', e.target.value)} />
          </label>
          <div className="btn-row full">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
