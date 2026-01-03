import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';
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
        const res = await axios.get(`${API_BASE_URL}/p/${slug}`);
        setProvider(res.data);
      } catch {
        setError("Provider not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [slug]);

  const handleBookNow = () => {
    if (!user) {
      // 🔐 LOGIN ONLY HERE
      openLogin(`/book/${provider._id}`);
      return;
    }

    navigate(`/book/${provider._id}`);
  };

  if (loading) return <p>⏳ Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="public-provider-page">
      <div className="provider-card">
        {provider.photo && (
          <img src={provider.photo} alt={provider.name} />
        )}

        <h1>{provider.name}</h1>
        <p>{provider.serviceCategory}</p>
        <p>{provider.description}</p>

        <p>
          <strong>Price:</strong> {provider.priceEstimate} Birr
        </p>

        <button className="book-btn" onClick={handleBookNow}>
          📅 Book Now
        </button>
      </div>
    </div>
  );
};

export default PublicProvider;
