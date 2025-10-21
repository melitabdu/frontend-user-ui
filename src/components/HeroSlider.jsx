// src/components/HeroSlider.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

const HeroSlider = ({
  images = [],
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const sliderInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);
    return () => clearInterval(sliderInterval);
  }, [images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (images.length === 0) {
    return <div className="hero-slider">No images to display.</div>;
  }

  return (
    <div className="hero-slider-container">
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>Welcome</h1>
          <p>Book home services easily and quickly.</p>
          <p>Find the best service providers in your area.</p>
          <p>Get started by selecting a service category below.</p>
        </div>

        <button className="nav-button left" onClick={goToPrevious}>
          <ChevronLeft size={28} />
        </button>
        <button className="nav-button right" onClick={goToNext}>
          <ChevronRight size={28} />
        </button>

        <div className="hero-dots">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
