import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { unwrap } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';
import Dropzone from '../../components/admin/Dropzone';
import Flash from '../../components/admin/Flash';

const emptyForm = {
  title: '',
  client: '',
  description: '',
  category: '',
  thumbnail: '',
  images: [],
  tools: '',
  tags: '',
  projectUrl: '',
  videoUrl: '',
  layout: 'item',
  order: 0,
  isVisible: true,
  status: 'draft',
};

function readFilePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProjectEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [flash, setFlash] = useState({ message: '', type: 'ok' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    (async () => {
      const catRes = await api.get('/categories');
      setCategories(unwrap(catRes) || []);
      if (!isNew) {
        try {
          const res = await api.get(`/admin/projects/${id}`);
          const p = unwrap(res);
          setForm({
            title: p.title || '',
            client: p.client || '',
            description: p.description || '',
            category: p.category?._id || p.category || '',
            thumbnail: p.thumbnail || '',
            images: p.images || [],
            tools: (p.tools || []).join(', '),
            tags: (p.tags || []).join(', '),
            projectUrl: p.projectUrl || '',
            videoUrl: p.videoUrl || '',
            layout: p.layout || 'item',
            order: p.order ?? 0,
            isVisible: p.isVisible !== false,
            status: p.status || 'draft',
          });
        } catch {
          setFlash({ message: 'Project not found', type: 'error' });
        } finally {
          setLoading(false);
        }
      }
    })().catch(() => setLoading(false));
  }, [id, isNew]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const onPickFiles = async (files) => {
    const next = [];
    for (const file of files) {
      const preview = await readFilePreview(file);
      next.push({
        file,
        preview,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      });
    }
    setPreviews((prev) => [...prev, ...next]);
  };

  const removePreview = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      const thumbnail =
        prev.thumbnail && images.some((img) => img.url === prev.thumbnail)
          ? prev.thumbnail
          : images[0]?.url || '';
      return { ...prev, images, thumbnail };
    });
  };

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append('file', file);
    const res = await api.post('/upload', data);
    return unwrap(res);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFlash({ message: '', type: 'ok' });
    try {
      const uploaded = [];
      for (const item of previews) {
        const media = await uploadFile(item.file);
        uploaded.push({
          url: media.url,
          type: item.type,
          order: form.images.length + uploaded.length,
        });
      }

      const images = [...form.images, ...uploaded].map((img, i) => ({
        url: img.url,
        type: img.type || 'image',
        order: i,
      }));

      const payload = {
        title: form.title,
        client: form.client,
        description: form.description,
        category: form.category || null,
        thumbnail: form.thumbnail || images[0]?.url || '',
        images,
        tools: form.tools
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        projectUrl: form.projectUrl,
        videoUrl: form.videoUrl,
        layout: form.layout,
        order: Number(form.order) || 0,
        isVisible: Boolean(form.isVisible),
        status: form.status,
      };

      if (isNew) {
        const res = await api.post('/admin/projects', payload);
        const created = unwrap(res);
        setFlash({ message: 'Project created', type: 'ok' });
        navigate(`/admin/projects/${created._id}`, { replace: true });
      } else {
        await api.put(`/admin/projects/${id}`, payload);
        setForm((prev) => ({ ...prev, images, thumbnail: payload.thumbnail }));
        setPreviews([]);
        setFlash({ message: 'Project saved', type: 'ok' });
      }
    } catch (err) {
      setFlash({ message: err.response?.data?.message || 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="topbar">
          <h1>Project</h1>
        </div>
        <div className="main">
          <p className="muted">Loading…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <h1>{isNew ? 'New project' : 'Edit project'}</h1>
        <Link className="btn" to="/admin/projects">
          Back
        </Link>
      </div>
      <div className="main">
        <Flash
          message={flash.message}
          type={flash.type}
          onClear={() => setFlash({ message: '', type: 'ok' })}
        />
        <form className="form-grid two" onSubmit={onSubmit}>
          <label className="field">
            Title
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </label>
          <label className="field">
            Client
            <input type="text" value={form.client} onChange={(e) => setField('client', e.target.value)} />
          </label>
          <label className="field full">
            Description
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </label>
          <label className="field">
            Category
            <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Layout
            <select value={form.layout} onChange={(e) => setField('layout', e.target.value)}>
              <option value="item">Item</option>
              <option value="wide">Wide</option>
              <option value="tall">Tall</option>
            </select>
          </label>
          <label className="field">
            Status
            <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="field">
            Order
            <input
              type="number"
              value={form.order}
              onChange={(e) => setField('order', e.target.value)}
            />
          </label>
          <label className="field">
            Tools (comma-separated)
            <input type="text" value={form.tools} onChange={(e) => setField('tools', e.target.value)} />
          </label>
          <label className="field">
            Tags (comma-separated)
            <input type="text" value={form.tags} onChange={(e) => setField('tags', e.target.value)} />
          </label>
          <label className="field">
            Project URL
            <input
              type="url"
              value={form.projectUrl}
              onChange={(e) => setField('projectUrl', e.target.value)}
            />
          </label>
          <label className="field">
            Video URL
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setField('videoUrl', e.target.value)}
            />
          </label>
          <label className="field" style={{ alignContent: 'center' }}>
            <span>
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(e) => setField('isVisible', e.target.checked)}
              />{' '}
              Visible on public gallery
            </span>
          </label>

          <div className="full">
            <p className="muted" style={{ marginBottom: '0.75rem' }}>
              Images &amp; videos — preview before upload, then save to upload &amp; attach.
              Supports common formats (JPG, PNG, WebP, GIF, HEIC, MP4, MOV, WebM, and more).
            </p>
            <Dropzone onFiles={onPickFiles} label="Drop images or videos, or click to browse" />
            <div className="thumbs">
              {form.images.map((img, i) => (
                <div className="thumb-card" key={`${img.url}-${i}`}>
                  {img.type === 'video' ? (
                    <video src={mediaUrl(img.url)} muted />
                  ) : (
                    <img src={mediaUrl(img.url)} alt="" />
                  )}
                  <div className="row">
                    <button
                      type="button"
                      onClick={() => setField('thumbnail', img.url)}
                      disabled={form.thumbnail === img.url}
                    >
                      {form.thumbnail === img.url ? 'Cover' : 'Set cover'}
                    </button>
                    <button type="button" onClick={() => removeImage(i)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {previews.map((item, i) => (
                <div className="thumb-card" key={`preview-${i}`}>
                  {item.type === 'video' ? (
                    <video src={item.preview} muted />
                  ) : (
                    <img src={item.preview} alt="" />
                  )}
                  <div className="row">
                    <span className="muted">Preview</span>
                    <button type="button" onClick={() => removePreview(i)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="btn-row full">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save project'}
            </button>
            <Link className="btn" to="/admin/projects">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
