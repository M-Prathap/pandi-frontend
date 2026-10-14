import { useSettings } from '../../context/SettingsContext';

export default function SiteFooter() {
  const { settings } = useSettings();
  const socials = settings.socials || {};
  const links = [
    socials.linkedin && { href: socials.linkedin, label: 'LinkedIn' },
    socials.behance && { href: socials.behance, label: 'Behance' },
    socials.dribbble && { href: socials.dribbble, label: 'Dribbble' },
    socials.instagram && { href: socials.instagram, label: 'Instagram' },
    socials.other && { href: socials.other, label: 'More' },
  ].filter(Boolean);

  return (
    <footer className="site-footer" id="site-footer">
      <span id="footer-meta">{settings.footerText || '© PARA Creative Origin'}</span>
      {links.length > 0 && (
        <span style={{ display: 'block', marginTop: '0.5rem' }}>
          {links.map((link, i) => (
            <span key={link.href}>
              {i > 0 ? ' · ' : ''}
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </span>
          ))}
        </span>
      )}
    </footer>
  );
}
