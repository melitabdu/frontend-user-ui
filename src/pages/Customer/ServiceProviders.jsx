// src/pages/ServiceProviders.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServiceProviders.css';
import { ChevronLeft } from 'lucide-react';

const colors = ['#d4edda', '#d1ecf1', '#f8d7da', '#f3e8ff', '#e3d7f4', '#ffeacc'];

const ServiceProviders = () => {
  const { category } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(null);
  const navigate = useNavigate();

  // ✅ Create local Axios instance with deployed backend URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // your deployed backend
  });

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get(`/api/providers/category/${category}`);

        // ✅ Ensure response is an array
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.providers)
          ? res.data.providers
          : [];

        setProviders(data);

        if (data.length === 0) {
          console.warn('No providers found for this category.');
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [category]);

  return (
    <div className="provider-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={20} /> Back to Home
      </button>

      <h2 className="provider-title">{category} Providers</h2>

      {loading ? (
        <p>Loading...</p>
      ) : providers.length === 0 ? (
        <p>No providers found for this category.</p>
      ) : (
        <div className="provider-grid">
          {providers.map((provider, index) => {
            const photoURL =
              provider.photo && provider.photo.startsWith('http')
                ? provider.photo
                : 'https://via.placeholder.com/150?text=No+Image';

            return (
              <div
                key={provider._id}
                className="provider-card"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                {showDescription === provider._id ? (
                  <div className="provider-description-box">
                    <h3 className="provider-description-title">Description</h3>
                    <p>{provider.description || 'N/A'}</p>
                  </div>
                ) : (
                  <>
                    <img src={photoURL} alt={provider.name} className="provider-photo" />
                    <h3>{provider.name}</h3>
                    <p>
                      <strong>Price:</strong> {provider.priceEstimate || 'N/A'} ETB / day
                    </p>
                  </>
                )}

                <div className="provider-buttons">
                  <button
                    onClick={() =>
                      setShowDescription(
                        showDescription === provider._id ? null : provider._id
                      )
                    }
                    className="btn btn-description"
                  >
                    {showDescription === provider._id ? 'Hide' : 'Description'}
                  </button>

                  <button
                    onClick={() => navigate(`/book/${provider._id}`)}
                    className="btn btn-booknow"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceProviders;
