import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../styles/public.scss';
import SiteHeader from '../components/public/SiteHeader';
import NavOverlay from '../components/public/NavOverlay';
import SiteFooter from '../components/public/SiteFooter';

function modeForPath(pathname) {
  if (pathname.startsWith('/project/')) return 'mode-stage';
  if (pathname === '/about' || pathname === '/contact') return 'mode-page';
  return 'mode-gallery';
}

export default function PublicLayout() {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const mode = modeForPath(location.pathname);
    document.body.classList.remove('mode-gallery', 'mode-page', 'mode-stage', 'admin-app');
    document.body.classList.add(mode);
    setNavOpen(false);
    return () => {
      document.body.classList.remove('mode-gallery', 'mode-page', 'mode-stage');
    };
  }, [location.pathname]);

  return (
    <>
      <a className="skip" href="#app">
        Skip to content
      </a>
      <SiteHeader
        search={search}
        onSearchChange={setSearch}
        onOpenNav={() => setNavOpen(true)}
      />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />
      <main id="app">
        <Outlet context={{ search, setSearch }} />
      </main>
      <SiteFooter />
    </>
  );
}
