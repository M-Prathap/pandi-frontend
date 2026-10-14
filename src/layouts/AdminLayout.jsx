import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import '../styles/admin.scss';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/admin/Sidebar';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.remove('mode-gallery', 'mode-page', 'mode-stage', 'lightbox-open');
    document.body.classList.add('admin-app');
    const linkId = 'admin-ibm-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap';
      document.head.appendChild(link);
    }
    return () => {
      document.body.classList.remove('admin-app');
    };
  }, []);

  if (loading) {
    return (
      <div className="login-screen">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return (
    <div className="admin">
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
