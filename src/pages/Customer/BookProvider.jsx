// src/pages/Customer/BookProvider.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BookProvider.css';

const BookProvider = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/providers/${id}`);
        setProvider(res.data);
      } catch (error) {
        console.error('የአገልጋይ መረጃን ማግኘት አልተቻለም።', error);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/provider/${id}`);
        const dates = res.data.map(b => new Date(b.serviceDate));
        setBookedDates(dates);
      } catch (error) {
        console.error('የተያዙ ቀናትን ማግኘት አልተቻለም።', error);
      }
    };

    fetchProvider();
    fetchBookedDates();
  }, [id]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('እባክዎ መጀመሪያ ይግቡ።');

      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          providerId: id,
          serviceDate: selectedDate,
          address,
          location: { lat: 0, lng: 0 }, // enhance this later
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('✅ የመያዣ መረጃ በትክክል ተልኳል!');
      setSelectedDate(null);
      setAddress('');
    } catch (error) {
      setMessage('❌ የመያዣ ሂደት አልተሳካም።');
      console.error(error);
    }
  };

  const isDateDisabled = date =>
    bookedDates.some(d => d.toDateString() === date.toDateString());

  return (
    <div className="book-provider-container">
      <div className="booking-card">
        <h2 className="booking-title">የአገልግሎት ተደራሽ ማያዣ</h2>
        {provider && (
          <>
            <p className="provider-name">አገልጋይ: <strong>{provider?.name}</strong></p>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileDisabled={({ date }) => isDateDisabled(date)}
            />

            <input
              type="text"
              placeholder="አድራሻዎን ያስገቡ"
              value={address}
              className="booking-input"
              onChange={e => setAddress(e.target.value)}
            />

            <button
              onClick={handleBooking}
              className="booking-button"
              disabled={!selectedDate || !address}
            >
              ማረጋገጫ ያድርጉ
            </button>

            {message && <p className="booking-message">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default BookProvider;
