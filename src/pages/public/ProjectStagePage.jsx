import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { unwrap } from '../../services/api';
import StageView from '../../components/public/StageView';

export default function ProjectStagePage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        if (!cancelled) setProject(unwrap(res));
      } catch {
        if (!cancelled) setError('Project not found.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="stage">
        <div className="stage__body">
          <h1 className="stage__title">{error}</h1>
          <Link className="stage__back" to="/">
            ← Back to gallery
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="stage">
        <div className="stage__body">
          <p className="stage__copy">Loading…</p>
        </div>
      </div>
    );
  }

  return <StageView project={project} />;
}
