import React, { useState } from 'react';
import './LoginModal.css';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const { loginUser, registerUser } = useAuth();



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && (!/^[0-9]*$/.test(value) || value.length > 10)) return;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^09\d{8}$/.test(form.phone)) {
      alert('ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (ለምሳሌ: 0912345678)');
      return;
    }

    if (form.password.length < 6) {
      alert('የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።');
      return;
    }

    try {
      setLoading(true);
      const userData = isNew
        ? await registerUser(form)
        : await loginUser(form);

      console.log('✅ Token:', localStorage.getItem('token'));
      alert(`እንኳን ደህና መጡ ${userData.name || ''}`);
      onClose(); // Close modal
    } catch (err) {
      alert(err.message || 'አልተሳካም።');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3>{isNew ? 'መመዝገብ' : 'ግባ'}</h3>
        <form onSubmit={handleSubmit}>
          {isNew && (
            <>
              <label>ስም:</label>
              <input
                name="name"
                type="text"
                value={form.name}
                placeholder="ስም ያስገቡ"
                onChange={handleChange}
                required
              />
            </>
          )}
          <label>ስልክ ቁጥር:</label>
          <input
            name="phone"
            type="tel"
            maxLength="10"
            placeholder="09xxxxxxxx"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <label>የይለፍ ቃል:</label>
          <input
            name="password"
            type="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'እባክዎን ይጠብቁ...' : isNew ? 'ይመዝገቡ' : 'ግባ'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          {isNew ? 'አስቀድሞ ተመዝግበዋል?' : 'አዲስ ነኝ?'}{' '}
          <button
            style={{
              border: 'none',
              background: 'none',
              color: '#1a5d1a',
              cursor: 'pointer',
            }}
            onClick={() => setIsNew(!isNew)}
          >
            {isNew ? 'ይግቡ' : 'መመዝገብ'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
