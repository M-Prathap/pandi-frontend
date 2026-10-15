import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import '../styles/admin.scss';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/admin/Sidebar';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.classList.remove('mode-gallery', 'mode-page', 'mode-stage', 'lightbox-open');
    document.body.classList.add('admin-app');
    const linkId = 'admin-ibm-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap';
      document.head.appendChild(link);
    }
    return () => {
      document.body.classList.remove('admin-app');
    };
  }, []);

  // Close drawer on page navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

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
      {/* Mobile Sticky Header Bar */}
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={drawerOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className="mobile-brand">
          <span className="brand-dot" />
          PARA CMS
        </div>

        <a href="/" target="_blank" rel="noreferrer" className="mobile-view-site" title="View live site">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`mobile-backdrop ${drawerOpen ? 'is-active' : ''}`}
        onClick={() => setDrawerOpen(false)}
        role="presentation"
      />

      {/* Main Sidebar (Drawer on mobile, permanent on desktop) */}
      <Sidebar isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Page Content */}
      <div className="admin-body">
        <Outlet />
      </div>

      {/* Bottom Navigation Dock for Mobile (Quick Thumb Navigation) */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span>Dash</span>
        </NavLink>

        <NavLink to="/admin/projects" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>Projects</span>
        </NavLink>

        <NavLink to="/admin/media" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Media</span>
        </NavLink>

        <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className={`mobile-more-btn ${drawerOpen ? 'active' : ''}`}
          onClick={() => setDrawerOpen((prev) => !prev)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}
