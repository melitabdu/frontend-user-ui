import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../../socket';
import { useAuth } from '../../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
  const { token, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [message, setMessage] = useState('');
  const latestBookingRef = useRef(null);

  // ✅ Axios instance using VITE_API_BASE_URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/users/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
      setMessage('❌ የቀጠሮዎችን መጠበቅ አልተሳካም።');
    }
  };

  const handleCopy = (phone, bookingId) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(bookingId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  // ✅ Listen to real-time booking updates
  useEffect(() => {
    socket.on('booking-paid', fetchBookings);
    socket.on('booking-confirmed', fetchBookings);
    socket.on('booking-updated', fetchBookings);
    socket.on('booking-deleted', fetchBookings);

    return () => {
      socket.off('booking-paid', fetchBookings);
      socket.off('booking-confirmed', fetchBookings);
      socket.off('booking-updated', fetchBookings);
      socket.off('booking-deleted', fetchBookings);
    };
  }, []);

  useEffect(() => {
    if (latestBookingRef.current) {
      latestBookingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [bookings]);

  return (
    <div className="my-bookings-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← ወደ መነሻ
      </button>

      <h2 className="heading">📖 የኔ ቀጠሮዎች</h2>
      {message && <p className="error-message">{message}</p>}

      {bookings.length === 0 ? (
        <p className="no-bookings">ምንም ቀጠሮ አልተያዘም።</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b, index) => (
            <div
              key={b._id}
              className={`booking-card ${index === bookings.length - 1 ? 'latest-booking' : ''}`}
              ref={index === bookings.length - 1 ? latestBookingRef : null}
            >
              <h3>👤 የባለሞያው ስም: {b.provider?.name || 'N/A'}</h3>
              <p>📅 ቀን: {new Date(b.date).toLocaleDateString()}</p>
              <p>📍 አድራሻ: {b.address}</p>
              <p>📌 ሁኔታ: {b.status}</p>

              <div className="booking-info">
                {b.status === 'confirmed' && !b.paid && (
                  <p className="info-message">
                    ✅ ጥያቄዎ ተሳክቷል። እባኮትን ክፍያ በንግድ ባንክ 1000525434587 ወይም በቴሌ ቢር 0984735563 200 ብር ያድርጉ።
                  </p>
                )}

                {b.paid && (
                  <>
                    <p className="success-message">
                      ✅ በተሳካ ሁኔታ ክፍያ ተከናውኗል። እባኮትን ባለሞያዉን ይደውሉ።
                    </p>
                    <p>📞 <strong>{b.provider?.phone}</strong></p>
                    <button
                      onClick={() => handleCopy(b.provider?.phone, b._id)}
                      className="copy-btn"
                    >
                      📋 {copiedId === b._id ? 'ተቀድቷል!' : 'ስልኩን ኮፒ አድርግ'}
                    </button>
                  </>
                )}

                {b.status !== 'confirmed' && !b.paid && (
                  <p className="pending-message">
                    ⚠️ በመጠባበቅ ላይ ነው። እባክዎ እስኪፈቀድ እና ክፍያው እስከሚከናዉኑ ይጠብቁ።
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={logoutUser} className="logout-btn">
        🚪 ውጣ
      </button>
    </div>
  );
};

export default MyBookings;
