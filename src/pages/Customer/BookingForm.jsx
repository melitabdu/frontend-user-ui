import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.css';
import { useAuth } from '../../context/AuthContext';
import socket from '../../socket';
import { ArrowLeft } from 'lucide-react'; // simple back icon

const BookingForm = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [bookedDates, setBookedDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const normalizeDates = (data) =>
    data
      .map((item) => {
        const rawDate = item.date || item;
        if (!rawDate) return null;
        const dateObj = new Date(rawDate);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj;
      })
      .filter(Boolean);

  const fetchBookedDates = async () => {
    if (!providerId) return;
    try {
      const res = await api.get(`/api/bookings/provider/${providerId}`);
      setBookedDates(normalizeDates(res.data));
    } catch (err) {
      console.error('Error fetching booked dates:', err.message);
    }
  };

  const fetchUnavailableDates = async () => {
    if (!providerId) return;
    try {
      const res = await api.get(`/api/providers/unavailable-dates/${providerId}`);
      setUnavailableDates(normalizeDates(res.data));
    } catch (err) {
      console.error('Error fetching unavailable dates:', err.message);
    }
  };

  useEffect(() => {
    fetchBookedDates();
    fetchUnavailableDates();
  }, [providerId]);

  useEffect(() => {
    socket.on('booking-confirmed', fetchBookedDates);
    socket.on('booking-updated', fetchBookedDates);
    socket.on('booking-deleted', fetchBookedDates);
    return () => {
      socket.off('booking-confirmed', fetchBookedDates);
      socket.off('booking-updated', fetchBookedDates);
      socket.off('booking-deleted', fetchBookedDates);
    };
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Geolocation denied:', err.message)
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage('⛔ እባክዎ መጀመሪያ ይግቡ።');
    if (!selectedDate || !address) return setMessage('⛔ ሁሉም መስኮች አስፈላጊ ናቸው።');
    if (!location.lat || !location.lng) return setMessage('⛔ አካባቢን ማግኘት አስፈላጊ ነው።');

    const selectedStr = formatDate(selectedDate);
    const bookedStrs = bookedDates.map(formatDate);
    const unavailableStrs = unavailableDates.map(formatDate);

    if (bookedStrs.includes(selectedStr) || unavailableStrs.includes(selectedStr)) {
      return setMessage('⛔ ይህ ቀን አልተሰጠም ወይም ተይዞዋል።');
    }

    try {
      setLoading(true);
      await api.post(
        '/api/bookings',
        {
          providerId,
          date: selectedStr,
          address,
          location,
          customerName: user?.name,
          customerPhone: user?.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ የቀጠሮው ጥያቄ ተሳክቷል!');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking failed:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'እባክዎ ደግመው ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <div className="booking-card">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> ተመለስ
          </button>
          <h2>📅 የቀጠሮ መሙያ ፎርም</h2>
        </div>

        {message && <p className="form-message">{message}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>ሙሉ ስም:</label>
            <input type="text" value={user?.name || ''} disabled />
          </div>

          <div className="form-group">
            <label>የስልክ ቁጥር:</label>
            <input type="text" value={user?.phone || ''} disabled />
          </div>

          <div className="form-group full-width">
            <label>ቀን ይምረጡ:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(d) => setSelectedDate(d)}
              excludeDates={[...bookedDates, ...unavailableDates]}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="ቀን ይምረጡ"
              className="date-picker-input"
              calendarClassName="custom-calendar"
              dayClassName={(date) => {
                const dayStr = formatDate(date);
                if (bookedDates.some((d) => formatDate(d) === dayStr)) return 'booked-date';
                if (unavailableDates.some((d) => formatDate(d) === dayStr)) return 'unavailable-date';
                return undefined;
              }}
            />
          </div>

          <div className="form-group full-width">
            <label>የአገልግሎት አድራሻ:</label>
            <input
              type="text"
              placeholder="አድራሻዎን ያስገቡ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'በመላክ ላይ...' : 'ያረጋግጡ'}
          </button>
        </form>

        {location.lat && location.lng && (
          <div className="map-preview">
            <h4>📍 እርስዎ ያሉበት ቦታ:</h4>
            <iframe
              title="የአካባቢ እይታ"
              width="100%"
              height="220"
              style={{ borderRadius: '8px' }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
