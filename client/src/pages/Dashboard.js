import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, avgScore: 0, departments: 0, topPerformer: '-' });
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/employees');
        const total = data.length;
        const avgScore = total ? (data.reduce((a, b) => a + b.performanceScore, 0) / total).toFixed(1) : 0;
        const departments = new Set(data.map(e => e.department)).size;
        const topPerformer = total ? data.reduce((a, b) => a.performanceScore > b.performanceScore ? a : b).name : '-';
        setStats({ total, avgScore, departments, topPerformer });
        setRecentEmployees(data.slice(0, 4));
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: '👥', label: 'Total Employees', value: stats.total, color: '#4facfe' },
    { icon: '⭐', label: 'Avg Performance', value: stats.avgScore + '%', color: '#f093fb' },
    { icon: '🏢', label: 'Departments', value: stats.departments, color: '#43e97b' },
    { icon: '🏆', label: 'Top Performer', value: stats.topPerformer, color: '#fa709a', small: true },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Good day, {user?.name} 👋</h1>
          <p style={styles.subGreeting}>Here's your HR overview for today</p>
        </div>
        <button style={styles.addBtn} onClick={() => navigate('/add-employee')}>
          ➕ Add Employee
        </button>
      </div>

      <div style={styles.grid}>
        {statCards.map(({ icon, label, value, color, small }) => (
          <div key={label} style={styles.card}>
            <div style={{...styles.cardIcon, background: color + '22', color}}>
              {icon}
            </div>
            <div>
              <p style={styles.cardLabel}>{label}</p>
              <p style={{...styles.cardValue, fontSize: small ? '1.2rem' : '2rem'}}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🕐 Recent Employees</h2>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'Department', 'Score', 'Experience'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map(emp => (
                <tr key={emp._id} style={styles.tr}>
                  <td style={styles.td}>{emp.name}</td>
                  <td style={styles.td}><span style={styles.deptBadge}>{emp.department}</span></td>
                  <td style={styles.td}>
                    <div style={styles.scoreBar}>
                      <div style={{...styles.scoreBarFill, width: emp.performanceScore + '%',
                        background: emp.performanceScore >= 75 ? '#43e97b' : emp.performanceScore >= 50 ? '#fa709a' : '#e94560'}} />
                      <span style={styles.scoreText}>{emp.performanceScore}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{emp.experience} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentEmployees.length === 0 && (
            <p style={styles.empty}>No employees yet. <span style={{color:'#e94560', cursor:'pointer'}} onClick={() => navigate('/add-employee')}>Add one!</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  greeting: { fontSize: '2rem', fontWeight: '800', color: '#fff' },
  subGreeting: { color: 'rgba(255,255,255,0.5)', marginTop: '5px' },
  addBtn: {
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    color: '#fff', border: 'none', padding: '12px 25px',
    borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' },
  card: {
    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', padding: '25px', display: 'flex', gap: '20px', alignItems: 'center',
  },
  cardIcon: { fontSize: '2rem', padding: '15px', borderRadius: '12px' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '5px' },
  cardValue: { fontWeight: '800', color: '#fff', lineHeight: 1 },
  section: {},
  sectionTitle: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: '#fff' },
  tableWrap: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '15px 20px', color: '#fff', fontSize: '0.95rem' },
  deptBadge: { background: 'rgba(79,172,254,0.15)', color: '#4facfe', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' },
  scoreBar: { display: 'flex', alignItems: 'center', gap: '10px' },
  scoreBarFill: { height: '6px', borderRadius: '3px', minWidth: '20px', maxWidth: '100px' },
  scoreText: { fontSize: '0.9rem', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' },
};

export default Dashboard;