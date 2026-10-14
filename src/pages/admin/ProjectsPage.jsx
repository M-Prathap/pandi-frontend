import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { unwrap } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Flash from '../../components/admin/Flash';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [flash, setFlash] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    const res = await api.get('/admin/projects');
    setProjects(unwrap(res) || []);
  }, []);

  useEffect(() => {
    load().catch(() => setProjects([]));
  }, [load]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/admin/projects/${pendingDelete._id}`);
      setFlash('Project deleted');
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
        <h1>Projects</h1>
        <Link className="btn btn-primary" to="/admin/projects/new">
          New project
        </Link>
      </div>
      <div className="main">
        <Flash message={flash} onClear={() => setFlash('')} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Visible</th>
                <th>Order</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.thumbnail ? (
                      <img className="thumb" src={mediaUrl(p.thumbnail)} alt="" />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category?.name || '—'}</td>
                  <td>
                    <span className={`badge ${p.status}`}>{p.status}</span>
                  </td>
                  <td>{p.isVisible ? 'Yes' : 'No'}</td>
                  <td>{p.order ?? 0}</td>
                  <td>
                    <div className="actions">
                      <Link className="btn" to={`/admin/projects/${p._id}`}>
                        Edit
                      </Link>
                      <button type="button" className="btn btn-danger" onClick={() => setPendingDelete(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted">
                    No projects yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete project?"
        message={`Delete “${pendingDelete?.title}”? This cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
