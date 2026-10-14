import { useCallback, useEffect, useState } from 'react';
import api, { unwrap } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';
import Dropzone from '../../components/admin/Dropzone';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Flash from '../../components/admin/Flash';

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [flash, setFlash] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get('/media');
    setItems(unwrap(res) || []);
  }, []);

  useEffect(() => {
    load().catch(() => setItems([]));
  }, [load]);

  const onFiles = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        await api.post('/upload', data);
      }
      setFlash('Upload complete');
      await load();
    } catch (err) {
      setFlash(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/media/${pendingDelete._id}`);
      setFlash('Media deleted');
      setPendingDelete(null);
      await load();
    } catch (err) {
      setFlash(err.response?.data?.message || 'Delete failed');
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="topbar">
        <h1>Media</h1>
      </div>
      <div className="main">
        <Flash message={flash} onClear={() => setFlash('')} />
        <Dropzone
          onFiles={onFiles}
          label={uploading ? 'Uploading…' : 'Drop images or videos, or click to upload'}
        />
        <div className="media-grid" style={{ marginTop: '1.25rem' }}>
          {items.map((item) => (
            <div className="media-card" key={item._id}>
              {item.mimeType?.startsWith('video/') ? (
                <video src={mediaUrl(item.url)} muted />
              ) : (
                <img src={mediaUrl(item.url)} alt={item.filename || ''} />
              )}
              <div className="row" style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span className="muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.filename}
                </span>
                <button type="button" className="btn btn-danger" onClick={() => setPendingDelete(item)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p className="muted">No media uploaded yet.</p>}
      </div>
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete media?"
        message={`Delete “${pendingDelete?.filename}”?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
