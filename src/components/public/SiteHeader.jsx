import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { mediaUrl } from '../../utils/mediaUrl';

export default function SiteHeader({ search, onSearchChange, onOpenNav }) {
  const { settings } = useSettings();
  const logo = mediaUrl(settings.logoUrl) || '/para-logo.svg';

  return (
    <header className="site-header" id="site-header">
      <Link className="wordmark" id="wordmark" to="/" aria-label="PARA Creative Origin home">
        <img
          className="wordmark__logo"
          id="wordmark-logo"
          src={logo}
          alt=""
          width="44"
          height="44"
          decoding="async"
        />
        <span className="wordmark__text">
          <span className="wordmark__name" id="wordmark-name">
            <span className="wordmark__line wordmark__line--primary">
              {settings.brandName || 'PARA'}
            </span>
            <span className="wordmark__line wordmark__line--secondary">
              {settings.brandSecondary || 'Creative Origin'}
            </span>
          </span>
          <span className="wordmark__tagline">{settings.tagline || 'Packaging & Branding Studio'}</span>
        </span>
      </Link>

      <div className="header-search">
        <label className="sr-only" htmlFor="search-input">
          Search products
        </label>
        <span className="header-search__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </span>
        <input
          type="search"
          id="search-input"
          placeholder="Search product"
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <Link className="header-icon" to="/" aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
          </svg>
        </Link>
        <Link className="btn-accent" to="/about">
          Follow us
        </Link>
        <Link className="btn-accent btn-accent--solid" to="/contact">
          Contact us
        </Link>
        <button
          className="nav-toggle"
          id="nav-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="nav-overlay"
          onClick={onOpenNav}
        >
          <span />
        </button>
      </div>
    </header>
  );
}
