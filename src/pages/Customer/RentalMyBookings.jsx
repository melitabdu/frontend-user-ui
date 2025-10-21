// src/pages/rentals/MyRentalBookings.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyRentalBookings = () => {
  const { token, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const latestBookingRef = useRef(null);

  const fetchBookings = async () => {
    if (!token) {
      setMessage("⚠️ Please log in to view your bookings.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/rental-bookings/my-bookings",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data?.data || res.data || [];
      setBookings(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
      setMessage("❌ Could not fetch rental bookings.");
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  useEffect(() => {
    if (latestBookingRef.current) {
      latestBookingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [bookings]);

  // ✅ Function to show status messages in Amharic
  const getStatusMessage = (booking) => {
    if (booking.status === "pending") return "በመጠባበቅ ላይ።";
    if (booking.status === "owner_confirm") return "ባለቤት አረጋገጠዋል። እባኮትን ክፍያ  በንግድ ባንክ አካውንት 1000525434587 ወይም በቴሌ ቢር 0984735563 200 ብር ገቢ ያድርጉ ።";
    if (booking.status === "awaiting_payment") return "ጥያቄዎ ተሳክቷል። እባኮትን ክፍያ  በንግድ ባንክ አካውንት 1000525434587 ወይም በቴሌ ቢር 0984735563 200 ብር ገቢ ያድርጉ።;"
        if (booking.status === "processing") return "ክፍያዎ ተቀባይነት አግኝቶዋል።  ባለቤቱ ይደውሉሎታል።";
    if (booking.status === "completed") return "ክፍያ ተሰጥቷል። አገልግሎቱ ተጠናቆል።";
    if (booking.status === "cancelled") return "ቦታዎ ተሰርዟል።";
    return "";
  };

  return (
    <div className="my-bookings-container">
      <button onClick={() => navigate("/rentals")} className="back-btn">
        ← Back to Rentals
      </button>

      <h2>📖 የእኔ  ኪራይ ጥያቄዎች</h2>
      {message && <p className="error-message">{message}</p>}

      {bookings.length === 0 ? (
        <p>ምንም ኪራይ ጥያቄ አልተገኘም።</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b, index) => (
            <div
              key={b._id}
              className={`booking-card ${
                index === bookings.length - 1 ? "latest-booking" : ""
              }`}
              ref={index === bookings.length - 1 ? latestBookingRef : null}
            >
              <h3>🏠 {b.propertyId?.title || "N/A"}</h3>
              <p>
                📅 {b.startDate ? new Date(b.startDate).toLocaleDateString() : "?"} -{" "}
                {b.endDate ? new Date(b.endDate).toLocaleDateString() : "?"}
              </p>
              <p>📍 {b.propertyId?.location || "N/A"}</p>
              <p>📌 Status: {b.status || "pending"}</p>
              <p style={{ color: "green", fontWeight: "bold" }}>{getStatusMessage(b)}</p>
            </div>
          ))}
        </div>
      )}

      {token && (
        <button onClick={logoutUser} className="logout-btn">
          🚪 Logout
        </button>
      )}
    </div>
  );
};

export default MyRentalBookings;
