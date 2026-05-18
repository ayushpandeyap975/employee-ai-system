import { useState } from 'react';
import axios from '../api/axios';

const AddEmployee = () => {
  const [form, setForm] = useState({ name:'', email:'', department:'', skills:'', performanceScore:'', experience:'' });
  const [msg, setMsg] = useState({ text:'', type:'' });
  const [loading, setLoading] = useState(false);

  const departments = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales'];

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience)
      };
      await axios.post('/employees', payload);
      setMsg({ text: '✅ Employee added successfully!', type: 'success' });
      setForm({ name:'', email:'', department:'', skills:'', performanceScore:'', experience:'' });
    } catch (err) {
      setMsg({ text: '❌ ' + (err.response?.data?.message || 'Error adding employee'), type: 'error' });
    }
    setLoading(false);
  };

  const fields = [
    { key: 'name', icon: '👤', placeholder: 'Full Name', type: 'text' },
    { key: 'email', icon: '📧', placeholder: 'Email Address', type: 'email' },
    { key: 'skills', icon: '🛠️', placeholder: 'Skills (e.g. React, Node.js, MongoDB)', type: 'text' },
    { key: 'performanceScore', icon: '⭐', placeholder: 'Performance Score (0-100)', type: 'number' },
    { key: 'experience', icon: '📅', placeholder: 'Years of Experience', type: 'number' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>➕ Add New Employee</h2>
          <p style={styles.subtitle}>Fill in the details below</p>
        </div>

        {msg.text && (
          <div style={{...styles.alert, background: msg.type === 'success' ? 'rgba(67,233,123,0.15)' : 'rgba(233,69,96,0.15)',
            borderColor: msg.type === 'success' ? 'rgba(67,233,123,0.4)' : 'rgba(233,69,96,0.4)',
            color: msg.type === 'success' ? '#43e97b' : '#ff6b81'}}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map(({ key, icon, placeholder, type }) => (
            <div key={key} style={styles.inputGroup}>
              <span style={styles.icon}>{icon}</span>
              <input style={styles.input} type={type} placeholder={placeholder}
                value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required />
            </div>
          ))}

          <div style={styles.inputGroup}>
            <span style={styles.icon}>🏢</span>
            <select style={{...styles.input, color: form.department ? '#fff' : 'rgba(255,255,255,0.4)'}}
              value={form.department} onChange={e => setForm({...form, department: e.target.value})} required>
              <option value="" disabled>Select Department</option>
              {departments.map(d => <option key={d} value={d} style={{background:'#1a1a2e'}}>{d}</option>)}
            </select>
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Adding...' : '🚀 Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 20px', minHeight: '90vh' },
  card: {
    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '500px', height: 'fit-content',
  },
  cardHeader: { marginBottom: '30px' },
  title: { fontSize: '1.6rem', fontWeight: '800', color: '#fff' },
  subtitle: { color: 'rgba(255,255,255,0.4)', marginTop: '5px' },
  alert: { padding: '14px', borderRadius: '10px', border: '1px solid', marginBottom: '20px', fontSize: '0.9rem' },
  inputGroup: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', marginBottom: '15px', overflow: 'hidden',
  },
  icon: { padding: '0 15px', fontSize: '1.1rem' },
  input: {
    flex: 1, padding: '14px 10px', background: 'transparent',
    border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', width: '100%',
  },
  btn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    color: '#fff', border: 'none', borderRadius: '12px',
    cursor: 'pointer', fontWeight: '700', fontSize: '1rem', marginTop: '10px',
  },
};

export default AddEmployee;