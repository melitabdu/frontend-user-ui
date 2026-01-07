import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./PublicProvider.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PublicProvider = ({ openLogin }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        // ✅ MATCHES BACKEND: GET /p/:slug
        const res = await axios.get(`${API_BASE_URL}/p/${slug}`);
        setProvider(res.data);
        setError("");
      } catch (err) {
        console.error("❌ Failed to load provider:", err);
        setError("Provider not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProvider();
  }, [slug]);

  const handleBookNow = () => {
    if (!provider) return;

    // 🔐 Login required ONLY when booking
    if (!user) {
      openLogin(`/book/${provider._id}`);
      return;
    }

    navigate(`/book/${provider._id}`);
  };

  if (loading) return <p>⏳ Loading provider...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="public-provider-page">
      <div className="provider-card">
        {provider.photo && (
          <img
            src={provider.photo}
            alt={provider.name}
            className="provider-photo"
          />
        )}

        <h1>{provider.name}</h1>
        <p className="category">{provider.serviceCategory}</p>

        {provider.description && (
          <p className="description">{provider.description}</p>
        )}

        {provider.priceEstimate && (
          <p className="price">
            <strong>Price:</strong> {provider.priceEstimate} Birr
          </p>
        )}

        <button className="book-btn" onClick={handleBookNow}>
          📅 Book Now
        </button>
      </div>
    </div>
  );
};

export default PublicProvider;
