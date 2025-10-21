// src/pages/Rentals/RentalBookingForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";
import "./RentalBookingForm.css";

const RentalBookingForm = () => {
  const { id } = useParams(); // propertyId from URL
  const propertyId = id;
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ፋይል መምረጥ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIdCard(file);

    if (!file) {
      setIdPreview(null);
      return;
    }

    if (file.type.startsWith("image")) {
      setIdPreview(URL.createObjectURL(file));
    } else {
      setIdPreview(null);
      setIdCard(null);
      alert("❌ እባክዎ የምስል ፋይል (jpg, jpeg, png) ብቻ ይምረጡ!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("⛔ እባክዎ መጀመሪያ ይግቡ።");
      return;
    }

    if (!fullName || !phone || !email || !startDate || !endDate) {
      setMessage("⚠️ እባክዎ ሁሉንም መስኮች ይሙሉ።");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
      formData.append("notes", notes);

      if (idCard) {
        formData.append("idCard", idCard);
      }

      await axios.post("http://localhost:5000/api/rental-bookings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ ቦኪንግ በተሳካ ሁኔታ ተሰጥቷል! እባክዎ ይጠበቁ...");
      
      setTimeout(() => {
        navigate("/my-rental-bookings");
      }, 2000);

      // ቅጽ መስተካከያ
      setStartDate(null);
      setEndDate(null);
      setNotes("");
      setIdCard(null);
      setIdPreview(null);
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message || "❌ ቦኪንግ አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <h2>የቤት ቦኪንግ ቅጽ</h2>
      {message && <div className="form-message">{message}</div>}
      <form onSubmit={handleSubmit} className="booking-form">
        <div>
          <label>ሙሉ ስም</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ስልክ ቁጥር</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ኢሜይል</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>መነሻ ቀን</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div>
          <label>መጨረሻ ቀን</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div>
          <label>የመታወቂያ ፎቶ ማስገባት (አማራጭ)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {idPreview && (
            <div className="preview-container">
              <img src={idPreview} alt="ID Preview" />
            </div>
          )}
        </div>
        <div>
          <label>ተጨማሪ ማስታወሻ (አማራጭ)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ማንኛውም ልዩ ጥያቄ..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "በመላክ ላይ..." : "ቦኪንግ ላክ"}
        </button>
      </form>
    </div>
  );
};

export default RentalBookingForm;
