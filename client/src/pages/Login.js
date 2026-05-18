import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data); navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>⚡</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to EmployeeAI</p>
        {error && <div style={styles.error}>⚠️ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>📧</span>
            <input style={styles.input} type="email" placeholder="Email address"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>🔒</span>
            <input style={styles.input} type="password" placeholder="Password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>
        <p style={styles.footer}>Don't have an account? <Link style={styles.link} to="/signup">Create one</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '50px 40px', borderRadius: '20px',
    width: '400px', textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  iconWrap: { fontSize: '3rem', marginBottom: '15px' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '8px' },
  subtitle: { color: 'rgba(255,255,255,0.5)', marginBottom: '30px' },
  error: {
    background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.4)',
    color: '#ff6b81', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem',
  },
  inputGroup: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', marginBottom: '15px', overflow: 'hidden',
  },
  inputIcon: { padding: '0 15px', fontSize: '1.1rem' },
  input: {
    flex: 1, padding: '14px 10px', background: 'transparent',
    border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem',
  },
  btn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    color: '#fff', border: 'none', borderRadius: '12px',
    cursor: 'pointer', fontWeight: '700', fontSize: '1rem',
    marginTop: '10px', marginBottom: '20px',
  },
  footer: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' },
  link: { color: '#e94560', fontWeight: '600', textDecoration: 'none' },
};

export default Login;