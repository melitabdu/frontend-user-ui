import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Import AuthContext
import "./RentalsHome.css";

const categories = [
  { id: "house", name: "House Rental የቤት ኪራይ", icon: "🏠" },
  { id: "car", name: "Car Rental የመኪና ኪራይ", icon: "🚗" },
  { id: "shop", name: "Shop Rental የሱቅ ኪራይ ", icon: "🏬" },
  { id: "store", name: "Store Rental የመጋዘን ኪራይ", icon: "📦" },
  { id: "whole/tent", name: "Whole/tent Rental የአዳራሽ/የድንኩዋን ኪራይ", icon: "📊" },
  { id: "other", name: "Other Rentals ለሎች", icon: "➕" },
];

const RentalsHome = ({ openLogin = () => alert("Please log in first!") }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); // ✅ Access user and token

  const handleCategoryClick = (id) => {
    if (!user || !token) {
      // ✅ If not logged in, open login modal or redirect
      openLogin();
      return;
    }
    // ✅ If logged in, navigate to rentals category
    navigate(`/rentals/${encodeURIComponent(id)}`);
  };

  return (
    <div className="rentals-home">
      <h1 className="rentals-home-title">Rentals</h1>

      <div className="rentals-category-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="rentals-category-card"
          >
            <div className="rentals-category-icon">{cat.icon}</div>
            <h2 className="rentals-category-name">{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalsHome;
