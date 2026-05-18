import { useState, useEffect } from 'react';
import axios from '../api/axios';

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);

  useEffect(() => { axios.get('/employees').then(({ data }) => setEmployees(data)); }, []);

  const getRecommendation = async () => {
    if (!selectedId) return alert('Please select an employee');
    setLoading(true); setResult(null);
    try {
      const { data } = await axios.post('/ai/recommend', { employeeId: selectedId });
      setResult(data);
    } catch (err) { alert('AI Error: ' + err.message); }
    setLoading(false);
  };

  const getRankings = async () => {
    setRankLoading(true); setRanking(null);
    try {
      const { data } = await axios.get('/ai/rank');
      setRanking(data);
    } catch (err) { alert('AI Error: ' + err.message); }
    setRankLoading(false);
  };

  const getRankColor = (i) => ['#FFD700', '#C0C0C0', '#CD7F32'][i] || 'rgba(255,255,255,0.3)';

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h2 style={styles.title}>🤖 AI Insights</h2>
        <p style={styles.subtitle}>Powered by advanced AI analysis</p>
      </div>

      <div style={styles.grid}>
        {/* Individual Recommendation */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎯 Individual Analysis</h3>
          <p style={styles.cardDesc}>Get AI-powered recommendations for a specific employee</p>

          <select style={styles.select} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">-- Select an Employee --</option>
            {employees.map(e => (
              <option key={e._id} value={e._id} style={{background:'#1a1a2e'}}>
                {e.name} — {e.department} (Score: {e.performanceScore})
              </option>
            ))}
          </select>

          <button style={styles.btn} onClick={getRecommendation} disabled={loading}>
            {loading ? <span>⏳ Analyzing with AI...</span> : <span>🔍 Generate Recommendation</span>}
          </button>

          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}>🤖</div>
              <p style={styles.loadingText}>AI is analyzing employee data...</p>
            </div>
          )}

          {result && (
            <div style={styles.resultBox}>
              <div style={styles.resultHeader}>
                <div style={styles.resultAvatar}>{result.employee.name.charAt(0)}</div>
                <div>
                  <h4 style={styles.resultName}>{result.employee.name}</h4>
                  <p style={styles.resultDept}>{result.employee.department} • Score: {result.employee.performanceScore}/100</p>
                </div>
              </div>
              <div style={styles.aiResponse}>
                <p style={styles.aiLabel}>🤖 AI Analysis:</p>
                <p style={styles.aiText}>{result.recommendation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Rankings */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🏆 Team Rankings</h3>
          <p style={styles.cardDesc}>AI-powered ranking and organizational analysis</p>

          <button style={{...styles.btn, background:'linear-gradient(135deg, #4facfe, #00f2fe)'}} onClick={getRankings} disabled={rankLoading}>
            {rankLoading ? '⏳ Ranking...' : '📊 Rank All Employees'}
          </button>

          {rankLoading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}>📊</div>
              <p style={styles.loadingText}>AI is ranking all employees...</p>
            </div>
          )}

          {ranking && (
            <div>
              <div style={styles.rankList}>
                {ranking.rankedEmployees.map((e, i) => (
                  <div key={e._id} style={styles.rankRow}>
                    <div style={{...styles.rankNum, color: getRankColor(i), borderColor: getRankColor(i)}}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                    </div>
                    <div style={styles.rankInfo}>
                      <p style={styles.rankName}>{e.name}</p>
                      <p style={styles.rankDept}>{e.department}</p>
                    </div>
                    <div style={{...styles.rankScore, color: getRankColor(i)}}>
                      {e.performanceScore}
                    </div>
                  </div>
                ))}
              </div>
              {ranking.aiAnalysis && (
                <div style={styles.aiResponse}>
                  <p style={styles.aiLabel}>🤖 AI Organizational Insights:</p>
                  <p style={styles.aiText}>{ranking.aiAnalysis}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  pageHeader: { marginBottom: '35px' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#fff' },
  subtitle: { color: 'rgba(255,255,255,0.4)', marginTop: '5px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' },
  card: {
    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '30px',
  },
  cardTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  cardDesc: { color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '25px' },
  select: {
    width: '100%', padding: '13px 15px', marginBottom: '15px',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none',
  },
  btn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    color: '#fff', border: 'none', borderRadius: '12px',
    cursor: 'pointer', fontWeight: '700', fontSize: '1rem', marginBottom: '20px',
  },
  loadingBox: { textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '15px' },
  spinner: { fontSize: '2.5rem', marginBottom: '10px' },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' },
  resultBox: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' },
  resultHeader: { display: 'flex', gap: '15px', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  resultAvatar: {
    width: '45px', height: '45px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', fontWeight: '800', flexShrink: 0,
  },
  resultName: { fontWeight: '700', color: '#fff', marginBottom: '3px' },
  resultDept: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' },
  aiResponse: { padding: '20px' },
  aiLabel: { color: '#e94560', fontWeight: '700', marginBottom: '10px', fontSize: '0.9rem' },
  aiText: { color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-wrap' },
  rankList: { marginBottom: '20px' },
  rankRow: {
    display: 'flex', alignItems: 'center', gap: '15px',
    padding: '12px', borderRadius: '10px', marginBottom: '8px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
  },
  rankNum: { fontSize: '1.3rem', minWidth: '40px', textAlign: 'center', fontWeight: '800' },
  rankInfo: { flex: 1 },
  rankName: { color: '#fff', fontWeight: '600', fontSize: '0.95rem' },
  rankDept: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '2px' },
  rankScore: { fontWeight: '800', fontSize: '1.2rem' },
};

export default AIRecommendations;