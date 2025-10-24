import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";
import "./RentalBookingForm.css";

const RentalBookingForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { id } = useParams();
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

  // ✅ Handle ID file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setIdPreview(null);

    if (file.type.startsWith("image")) {
      setIdCard(file);
      setIdPreview(URL.createObjectURL(file));
    } else {
      alert("❌ እባክዎ የምስል ፋይል (jpg, jpeg, png) ብቻ ይምረጡ!");
      setIdCard(null);
      setIdPreview(null);
    }
  };

  // ✅ Submit booking form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return setMessage("⛔ እባክዎ መጀመሪያ ይግቡ።");
    }

    if (!fullName || !phone || !email || !startDate || !endDate) {
      return setMessage("⚠️ እባክዎ ሁሉንም መስኮች ይሙሉ።");
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

      const res = await axios.post(`${API_BASE_URL}/api/rental-bookings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Booking success:", res.data);
      setMessage("✅ ቦኪንግ በተሳካ ሁኔታ ተሰጥቷል! እባክዎ ይጠበቁ...");

      // Redirect after 2 seconds
      setTimeout(() => navigate("/my-rental-bookings"), 2000);

      // Reset form
      setFullName(user?.name || "");
      setPhone(user?.phone || "");
      setEmail(user?.email || "");
      setStartDate(null);
      setEndDate(null);
      setNotes("");
      setIdCard(null);
      setIdPreview(null);
    } catch (err) {
      console.error("❌ Booking failed:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message || "❌ ቦኪንግ አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="booking-form-container">
      <h2 className="section-title">የኪራይ ቦኪንግ ቅጽ</h2>

      {message && <p className="form-message">{message}</p>}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>ሙሉ ስም</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>ስልክ ቁጥር</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>ኢሜይል</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>መነሻ ቀን</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="እባክዎ ቀን ይምረጡ"
          />
        </div>

        <div className="form-group">
          <label>መጨረሻ ቀን</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="እባክዎ ቀን ይምረጡ"
          />
        </div>

        <div className="form-group">
          <label>የመታወቂያ ፎቶ (አማራጭ)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {idPreview && (
            <div className="preview-container">
              <img src={idPreview} alt="ID Preview" className="preview-image" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>ተጨማሪ ማስታወሻ (አማራጭ)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ማንኛውም ልዩ ጥያቄ..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "በመላክ ላይ..." : "ቦኪንግ ላክ"}
        </button>
      </form>
    </section>
  );
};

export default RentalBookingForm;
