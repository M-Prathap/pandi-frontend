import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { unwrap } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/admin/projects/stats'),
          api.get('/admin/projects'),
        ]);
        setStats(unwrap(statsRes));
        setRecent((unwrap(projectsRes) || []).slice(0, 6));
      } catch {
        setStats({ total: 0, published: 0, drafts: 0, media: 0 });
      }
    })();
  }, []);

  return (
    <>
      <div className="topbar">
        <h1>Dashboard</h1>
        <Link className="btn btn-primary" to="/admin/projects/new">
          New project
        </Link>
      </div>
      <div className="main">
        <div className="stats">
          <div className="stat">
            <b>{stats?.total ?? '—'}</b>
            <span>Projects</span>
          </div>
          <div className="stat">
            <b>{stats?.published ?? '—'}</b>
            <span>Published</span>
          </div>
          <div className="stat">
            <b>{stats?.drafts ?? '—'}</b>
            <span>Drafts</span>
          </div>
          <div className="stat">
            <b>{stats?.media ?? '—'}</b>
            <span>Media</span>
          </div>
        </div>

        <div className="panel">
          <h2>Recent projects</h2>
          {recent.length === 0 && <p className="muted" style={{ padding: '1rem 1.4rem' }}>No projects yet.</p>}
          {recent.map((p) => (
            <Link key={p._id} className="recent-item" to={`/admin/projects/${p._id}`}>
              {p.thumbnail ? (
                <img src={mediaUrl(p.thumbnail)} alt="" />
              ) : (
                <div style={{ width: 60, height: 42, background: '#090d16', borderRadius: 6 }} />
              )}
              <div>
                <strong>{p.title}</strong>
                <div className="muted">{p.client || p.category?.name || '—'}</div>
              </div>
              <span className={`badge ${p.status}`}>{p.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
