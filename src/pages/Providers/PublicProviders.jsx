// src/pages/PublicProvider.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'

const PublicProvider = ({ openLogin }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get(`/api/providers/slug/${slug}`);
        setProvider(res.data);
      } catch (err) {
        console.error(err);
        setProvider(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [slug]);

  const handleBookNow = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      if (openLogin) openLogin();
      return;
    }

    navigate(`/book/${provider._id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!provider) return <p>Provider not found</p>;

  return (
    <div className="public-provider">
      <img
        src={provider.photo || 'https://via.placeholder.com/200'}
        alt={provider.name}
      />

      <h2>{provider.name}</h2>
      <p><strong>Service:</strong> {provider.serviceCategory}</p>
      <p><strong>Price:</strong> {provider.priceEstimate} ETB / day</p>
      <p>{provider.description}</p>

      <button onClick={handleBookNow} className="btn-booknow">
        Book Now
      </button>
    </div>
  );
};

export default PublicProvider;
