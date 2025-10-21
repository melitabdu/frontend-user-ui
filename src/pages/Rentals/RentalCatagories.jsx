// src/pages/Rentals/RentalsCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RentalItemCard from "./RentalItemCard";
import "./RentalCaragories.css";

const categoryNames = {
  house: "House Rental የቤት ኪራይ",
  car: "Car Rental የመኪና ኪራይ",
  shop: "Shop የሱቅ ኪራይ",
  store: "Store Rental የመጋዘን ኪራይ",
  whole: "Event Hall/tent Rental የአዳራሽ/ድርኩዋን ኪራይ",
  other: "Other Rentals ሌሎች ኪራይ",
};

const RentalsCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Local Axios instance with deployed backend URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/properties/category/${categoryId}`);

        // ✅ Ensure items is always an array
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.properties)
          ? res.data.properties
          : [];

        setItems(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProperties();
    }
  }, [categoryId]);

  return (
    <div className="rentals-category">
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#333",
          cursor: "pointer",
          marginBottom: "15px",
          display: "inline-block",
        }}
      >
        ← back
      </button>

      <h1 className="rentals-category-title">
        {categoryNames[categoryId] || "Rentals"}
      </h1>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : items.length === 0 ? (
        <p className="no-items">No items found in this category.</p>
      ) : (
        <div className="rental-items-grid">
          {items.map((item) => (
            <RentalItemCard key={item._id} property={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalsCategory;
