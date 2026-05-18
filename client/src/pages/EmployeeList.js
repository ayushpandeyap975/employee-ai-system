import { useState, useEffect } from 'react';
import axios from '../api/axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (dept = '') => {
    try {
      const url = dept ? `/employees/search?department=${dept}` : '/employees';
      const { data } = await axios.get(url);
      setEmployees(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await axios.delete(`/employees/${id}`);
    fetchEmployees(search);
  };

  const getScoreColor = (score) =>
    score >= 75 ? '#43e97b' : score >= 50 ? '#fa709a' : '#e94560';

  const getRating = (score) =>
    score >= 80 ? '🌟 Excellent' : score >= 60 ? '✅ Good' : score >= 40 ? '⚠️ Average' : '❌ Low';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>👥 Employee Directory</h2>
          <p style={styles.subtitle}>{employees.length} employees found</p>
        </div>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input style={styles.searchInput} placeholder="Search by department..."
            value={search} onChange={e => { setSearch(e.target.value); fetchEmployees(e.target.value); }} />
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>⏳ Loading employees...</div>
      ) : (
        <div style={styles.grid}>
          {employees.map(emp => (
            <div key={emp._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.avatar}>{emp.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 style={styles.empName}>{emp.name}</h3>
                  <p style={styles.empEmail}>{emp.email}</p>
                </div>
                <button style={styles.delBtn} onClick={() => handleDelete(emp._id)}>🗑️</button>
              </div>

              <div style={styles.deptRow}>
                <span style={styles.deptBadge}>🏢 {emp.department}</span>
                <span style={styles.expBadge}>📅 {emp.experience} yrs</span>
              </div>

              <div style={styles.scoreSection}>
                <div style={styles.scoreHeader}>
                  <span style={styles.scoreLabel}>Performance</span>
                  <span style={{...styles.scoreValue, color: getScoreColor(emp.performanceScore)}}>
                    {emp.performanceScore}/100
                  </span>
                </div>
                <div style={styles.barBg}>
                  <div style={{...styles.barFill, width: emp.performanceScore+'%', background: getScoreColor(emp.performanceScore)}} />
                </div>
                <span style={{...styles.rating, color: getScoreColor(emp.performanceScore)}}>{getRating(emp.performanceScore)}</span>
              </div>

              <div style={styles.skillsWrap}>
                {emp.skills.slice(0, 4).map(skill => (
                  <span key={skill} style={styles.skillBadge}>{skill}</span>
                ))}
                {emp.skills.length > 4 && <span style={styles.skillMore}>+{emp.skills.length - 4}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && employees.length === 0 && (
        <div style={styles.empty}>
          <div style={{fontSize:'4rem', marginBottom:'15px'}}>🔍</div>
          <p>No employees found for "<strong>{search}</strong>"</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#fff' },
  subtitle: { color: 'rgba(255,255,255,0.4)', marginTop: '5px' },
  searchWrap: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', overflow: 'hidden', minWidth: '280px',
  },
  searchIcon: { padding: '0 15px' },
  searchInput: { padding: '12px 10px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', flex: 1 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: {
    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', padding: '25px', transition: 'transform 0.2s',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  avatar: {
    width: '50px', height: '50px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.4rem', fontWeight: '800', flexShrink: 0,
  },
  empName: { fontSize: '1.05rem', fontWeight: '700', color: '#fff' },
  empEmail: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
  delBtn: { marginLeft: 'auto', background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.3)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  deptRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  deptBadge: { background: 'rgba(79,172,254,0.15)', color: '#4facfe', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' },
  expBadge: { background: 'rgba(240,147,251,0.15)', color: '#f093fb', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' },
  scoreSection: { marginBottom: '20px' },
  scoreHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  scoreLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' },
  scoreValue: { fontWeight: '700', fontSize: '0.9rem' },
  barBg: { background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px', marginBottom: '6px' },
  barFill: { height: '6px', borderRadius: '4px', transition: 'width 0.5s' },
  rating: { fontSize: '0.8rem', fontWeight: '600' },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  skillBadge: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem' },
  skillMore: { background: 'rgba(233,69,96,0.15)', color: '#e94560', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem' },
  loading: { textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' },
  empty: { textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' },
};

export default EmployeeList;