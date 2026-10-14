import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const links = [
  { to: '/', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function NavOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`nav-overlay${open ? ' is-open' : ''}`}
      id="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      hidden={!open}
    >
      <button className="nav-overlay-close" id="overlay-close" type="button" onClick={onClose}>
        Close
      </button>
      <nav id="overlay-nav" aria-label="Mobile">
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={onClose}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
