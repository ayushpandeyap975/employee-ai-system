import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/employees', label: '👥 Employees' },
    { to: '/add-employee', label: '➕ Add Employee' },
    { to: '/ai', label: '🤖 AI Insights' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>⚡</span>
        <span style={styles.brandText}>Employee<span style={styles.accent}>AI</span></span>
      </div>
      {user && (
        <div style={styles.links}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} style={{
              ...styles.link,
              ...(location.pathname === to ? styles.activeLink : {})
            }} to={to}>{label}</Link>
          ))}
          <div style={styles.userBadge}>👤 {user.name}</div>
          <button style={styles.btn} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 40px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky', top: 0, zIndex: 1000,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { fontSize: '1.8rem' },
  brandText: { fontSize: '1.5rem', fontWeight: '800', color: '#fff' },
  accent: { color: '#e94560' },
  links: { display: 'flex', gap: '8px', alignItems: 'center' },
  link: {
    color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
    padding: '8px 16px', borderRadius: '25px', fontSize: '0.9rem',
    transition: 'all 0.3s', fontWeight: '500',
  },
  activeLink: {
    background: 'rgba(233,69,96,0.2)',
    color: '#e94560',
    border: '1px solid rgba(233,69,96,0.4)',
  },
  userBadge: {
    background: 'rgba(255,255,255,0.1)',
    padding: '8px 16px', borderRadius: '25px',
    fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)',
  },
  btn: {
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    color: '#fff', border: 'none', padding: '8px 20px',
    borderRadius: '25px', cursor: 'pointer', fontWeight: '600',
    fontSize: '0.9rem',
  }
};

export default Navbar;