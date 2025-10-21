// src/pages/RentalItemCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RentalItemCards.css";

const RentalItemCard = ({ property }) => {
  const [zoomed, setZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const nextImage = (e) => {
    e.stopPropagation();
    setZoomIndex((prev) => (prev + 1) % (property.images?.length || 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setZoomIndex((prev) =>
      (prev - 1 + (property.images?.length || 1)) % (property.images?.length || 1)
    );
  };

  // ✅ Normalize image URLs for Cloudinary and deployed backend
  const imagesWithUrl = (property.images || []).map((img) => {
    if (!img) return "";
    if (typeof img === "object" && img.url) return img.url; // Cloudinary object
    if (typeof img === "string") {
      if (img.startsWith("http")) return img; // already full URL
      // ensure backend URL is used for relative image paths
      return `${API_BASE_URL}${img.startsWith("/uploads") ? img : `/uploads/${img}`}`;
    }
    return "";
  });

  return (
    <div className={`rental-item-card ${zoomed ? "zoomed-mode" : ""}`}>
      {!showDescription ? (
        <>
          {imagesWithUrl.length > 0 ? (
            <div className="image-wrapper">
              <img
                src={imagesWithUrl[zoomIndex]}
                alt={property.title}
                className={`item-image ${zoomed ? "zoomed" : ""}`}
                onClick={() => setZoomed(!zoomed)}
              />
              {zoomed && imagesWithUrl.length > 1 && (
                <>
                  <button className="zoom-btn left" onClick={prevImage}>
                    ◀
                  </button>
                  <button className="zoom-btn right" onClick={nextImage}>
                    ▶
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="item-image-placeholder">No Image</div>
          )}

          {!zoomed && (
            <>
              <h3 className="item-name">{property.title}</h3>
              <p className="item-price">💰ዋጋ {property.price} ብር /በቀን</p>
              <p className="item-address">📍አድራሻ {property.location}</p>
            </>
          )}
        </>
      ) : (
        <div className="item-description-box">
          <h3 className="item-description-title">Description</h3>
          <p className="item-description-text">
            {property.description || "No description available."}
          </p>
        </div>
      )}

      <div className="item-buttons">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="btn btn-description"
        >
          {showDescription ? "Hide" : "Description"}
        </button>

        <button
          onClick={() => navigate(`/rental-booking/${property._id}`)}
          className="btn btn-contact"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RentalItemCard;
