import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicProvider.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PublicProvider = () => {
  const { slug } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch provider by slug
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/p/${slug}`);
        setProvider(res.data);
      } catch (err) {
        setError("Provider not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [slug]);

  // 🔹 SEO: Page title & meta description
  useEffect(() => {
    if (provider) {
      document.title = `${provider.name} | Home Service Provider`;

      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }

      meta.setAttribute(
        "content",
        provider.description || "Trusted home service provider"
      );
    }
  }, [provider]);

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
        <p className="description">{provider.description}</p>

        <p>
          <strong>Price:</strong> {provider.priceEstimate} Birr / day
        </p>

        <a href={`tel:${provider.phone}`} className="call-btn">
          📞 Call Provider
        </a>

        <button
          className="book-btn"
          onClick={() => alert("Booking coming next 🚀")}
        >
          📅 Book Now
        </button>
      </div>
    </div>
  );
};

export default PublicProvider;
