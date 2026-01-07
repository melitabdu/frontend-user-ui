import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

/* Customer */
import CustomerHome from './pages/Customer/Home';
import ServiceCategories from './pages/Customer/ServiceCategories';
import ServiceProviders from './pages/Customer/ServiceProviders';
import BookingForm from './pages/Customer/BookingForm';
import MyBookings from './pages/Customer/MyBookings';

/* Rentals */
import RentalsHome from './pages/Rentals/RentalsHome';
import RentalsCategory from './pages/Rentals/RentalCatagories';
import RentalBookingForm from './pages/Rentals/RentalBookingForm';
import MyRentalBookings from './pages/Customer/RentalMyBookings';

/* Providers */
import PublicProvider from './pages/Providers/PublicProviders';

/* Auth */
import LoginModal from './components/LoginModal';

import './App.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loginOptions, setLoginOptions] = useState(null);

  // ✅ Open login modal
  const openLogin = (options = {}) => {
    setLoginOptions(options);
    setShowLogin(true);
  };

  // ✅ Close login modal
  const closeLogin = () => {
    setShowLogin(false);
    setLoginOptions(null);
  };

  return (
    <div className="App">
      <Navbar />

      {/* 🔐 Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={closeLogin}
          onSuccess={loginOptions?.onSuccess}
          redirectTo={loginOptions?.redirectTo}
        />
      )}

      <main>
        <Routes>

          {/* 🌍 Public provider page */}
          <Route
            path="/p/:slug"
            element={<PublicProvider openLogin={openLogin} />}
          />

          {/* 🏠 Home */}
          <Route path="/" element={<CustomerHome />} />

          {/* 🛠 Services */}
          <Route
            path="/services"
            element={<ServiceCategories openLogin={openLogin} />}
          />
          <Route
            path="/services/:category"
            element={<ServiceProviders />}
          />
          <Route
            path="/book/:providerId"
            element={<BookingForm />}
          />

          {/* 📦 My bookings */}
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* 🚗 Rentals */}
          <Route path="/rentals" element={<RentalsHome />} />
          <Route
            path="/rentals/:categoryId"
            element={<RentalsCategory />}
          />
          <Route
            path="/rental-booking/:id"
            element={<RentalBookingForm />}
          />
          <Route
            path="/my-rental-bookings"
            element={<MyRentalBookings />}
          />

        </Routes>
      </main>
    </div>
  );
};

export default App;
