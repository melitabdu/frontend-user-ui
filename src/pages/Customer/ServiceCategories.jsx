import React from 'react';
import './ServiceCategories.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaToolbox,
  FaUtensils,
  FaBroom,
  FaBolt,
  FaWrench,
  FaEllipsisH,
} from 'react-icons/fa';
import { ChevronLeft } from 'lucide-react';

const categories = [
  { name: 'Finishing Works', amharicName: 'የግንባታ የማጠናቀቂያ ስራዎች', icon: <FaToolbox /> },
  { name: 'Party Food Preparation', amharicName: 'የተለያየ የፕሮግራም ምግብ አዘጋጅ', icon: <FaUtensils /> },
  { name: 'Cleaning', amharicName: 'ማጽዳት', icon: <FaBroom /> },
  { name: 'Electricity', amharicName: 'ኤሌክትሪክነት የኤሌክትሪክ እቃዋች ጥገና', icon: <FaBolt /> },
  { name: 'Plumbing', amharicName: 'የባንባና የሻወር ቤት ሰራ', icon: <FaWrench /> },
  { name: 'Other Services', amharicName: 'ሌሎች አገልግሎቶች', icon: <FaEllipsisH /> },
];

const colors = ['#d4edda', '#d1ecf1', '#fff3cd', '#f8d7da', '#ffeacc', '#f3e8ff'];

const ServiceCategories = ({ openLogin = () => alert('በቅድሚያ ይመዝገቡ') }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleCategoryClick = (name) => {
    if (!user || !token) {
      openLogin();
      return;
    }
    navigate(`/services/${encodeURIComponent(name)}`);
  };

  return (
    <div className="categories-container">
      <button className="back-btn" onClick={() => navigate('/')}>
      
      </button>

      <h2 className="section-title">Our Service Categories</h2>
      <div className="categories-grid">
        {categories.map((cat, index) => {
          const bgColor = colors[index % colors.length];
          return (
            <div
              key={index}
              className="category-card"
              style={{ backgroundColor: bgColor }}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-icon">{cat.icon}</div>
              <p className="category-label" style={{ backgroundColor: bgColor }}>
                {cat.name}
                <br />
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {cat.amharicName}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategories;
