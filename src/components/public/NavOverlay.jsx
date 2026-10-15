import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { mediaUrl } from '../../utils/mediaUrl';

const navItems = [
  {
    to: '/',
    num: '01',
    label: 'Gallery',
    desc: 'Curated packaging, branding & print projects',
  },
  {
    to: '/about',
    num: '02',
    label: 'About Studio',
    desc: 'Craftsmanship, origin philosophy & Sivakasi prepress',
  },
  {
    to: '/contact',
    num: '03',
    label: 'Contact',
    desc: 'Project inquiries, quotes & studio commissions',
  },
  {
    to: '/admin',
    num: '04',
    label: 'Admin Portal',
    desc: 'PARA CMS management & content dashboard',
  },
];

export default function NavOverlay({ open, onClose }) {
  const { settings } = useSettings();
  const logo = mediaUrl(settings.logoUrl) || '/para-logo.svg';
  const socials = settings.socials || {};

  const socialLinks = [
    socials.instagram && { href: socials.instagram, label: 'Instagram' },
    socials.behance && { href: socials.behance, label: 'Behance' },
    socials.linkedin && { href: socials.linkedin, label: 'LinkedIn' },
    socials.dribbble && { href: socials.dribbble, label: 'Dribbble' },
  ].filter(Boolean);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div
      className={`nav-overlay${open ? ' is-open' : ''}`}
      id="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      aria-hidden={!open}
      hidden={!open}
    >
      <div className="nav-overlay-content">
        {/* Top bar with brand & close */}
        <div className="nav-overlay-header">
          <div className="nav-overlay-brand">
            <img src={logo} alt="" className="nav-overlay-logo" width="36" height="36" />
            <div className="nav-overlay-brand-text">
              <span className="brand-primary">{settings.brandName || 'PARA'}</span>
              <span className="brand-secondary">{settings.brandSecondary || 'Creative Origin'}</span>
            </div>
          </div>

          <button
            className="nav-overlay-close-btn"
            id="overlay-close"
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="nav-overlay-links" id="overlay-nav" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-overlay-item${isActive ? ' is-active' : ''}`}
              onClick={onClose}
            >
              <span className="item-num">{item.num}</span>
              <div className="item-body">
                <span className="item-label">{item.label}</span>
                <span className="item-desc">{item.desc}</span>
              </div>
              <span className="item-arrow" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Info & Socials */}
        <div className="nav-overlay-footer">
          <div className="footer-direct">
            <span className="footer-title">Direct Studio Contact</span>
            {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className="footer-contact-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {settings.contactEmail}
              </a>
            )}
            {settings.contactPhone && (
              <a href={`tel:${settings.contactPhone}`} className="footer-contact-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {settings.contactPhone}
              </a>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="footer-socials">
              {socialLinks.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="social-pill">
                  {s.label}
                </a>
              ))}
            </div>
          )}

          <div className="footer-tagline">
            {settings.footerText || '© PARA Creative Origin — Packaging & Branding Studio'}
          </div>
        </div>
      </div>
    </div>
  );
}
