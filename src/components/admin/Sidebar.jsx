import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/media', label: 'Media' },
  { to: '/admin/pages', label: 'Pages' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand">PARA CMS</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? 'is-active' : undefined)}
        >
          {link.label}
        </NavLink>
      ))}
      <div className="spacer" />
      <a href="/" target="_blank" rel="noreferrer">
        View site
      </a>
      <button type="button" className="navbtn" data-logout onClick={onLogout}>
        Log out
      </button>
    </aside>
  );
}
