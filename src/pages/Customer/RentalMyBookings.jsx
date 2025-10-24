import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";
import "./RentalBookingForm.css";

const RentalBookingForm = () => {
  const { id } = useParams(); // property ID from URL
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // ✅ Use environment variable for API base URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // ✅ Form state
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle file upload
  const handleFileChange = (e) => {
    setIdCard(e.target.files[0]);
  };

  // ✅ Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage("⛔ እባክዎ መጀመሪያ ይግቡ።");

    if (!startDate || !endDate) {
      return setMessage("⛔ እባክዎ የመጀመሪያና የመጨረሻ ቀን ይምረጡ።");
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("propertyId", id);
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
      formData.append("notes", notes);
      if (idCard) formData.append("idCard", idCard);

      const res = await api.post("/api/rental-bookings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Booking success:", res.data);
      setMessage("✅ ቦኪንግ በተሳካ ሁኔታ ተሰጥቷል!");
      setTimeout(() => navigate("/my-rental-bookings"), 2000);
    } catch (err) {
      console.error("❌ Booking failed:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message ||
          "❌ ቦኪንግ አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-booking-container">
      <h2 className="rental-booking-title">🏠 የኪራይ ቦኪንግ ቅፅ</h2>

      <form onSubmit={handleSubmit} className="rental-booking-form">
        <label>ሙሉ ስም</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label>ስልክ ቁጥር</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>ኢሜይል</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>መጀመሪያ ቀን</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          placeholderText="መጀመሪያ ቀን ይምረጡ"
        />

        <label>መጨረሻ ቀን</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={startDate || new Date()}
          placeholderText="መጨረሻ ቀን ይምረጡ"
        />

        <label>የመታወቂያ ካርድ (አማራጭ)</label>
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} />

        <label>ተጨማሪ መረጃ</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="የቦኪንግ ተጨማሪ መረጃ..."
        />

        <button type="submit" disabled={loading}>
          {loading ? "⏳ በመላክ ላይ..." : "📩 ቦኪንግ ይላኩ"}
        </button>
      </form>

      {message && <p className="rental-booking-message">{message}</p>}
    </div>
  );
};

export default RentalBookingForm;
