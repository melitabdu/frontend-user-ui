import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerHome from './pages/Customer/Home';
import ServiceCategories from './pages/Customer/ServiceCategories';
import ServiceProviders from './pages/Customer/ServiceProviders';
import BookingForm from './pages/Customer/BookingForm';
import MyBookings from './pages/Customer/MyBookings';
import LoginModal from './components/LoginModal';
import PublicProvider from './pages/Providers/PublicProviders';

import './App.css';

const App = () => {
  const [loginState, setLoginState] = useState({
    show: false,
    redirectTo: null,
  });

  const openLogin = (redirectTo = null) => {
    setLoginState({ show: true, redirectTo });
  };

  const closeLogin = () => {
    setLoginState({ show: false, redirectTo: null });
  };

  return (
    <div className="App">
      <Navbar />

      {loginState.show && (
        <LoginModal
          onClose={closeLogin}
          redirectTo={loginState.redirectTo}
        />
      )}

      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<CustomerHome />} />

          {/* Services */}
          <Route path="/services" element={<ServiceCategories />} />
          <Route path="/services/:category" element={<ServiceProviders />} />

          {/* ✅ PUBLIC PROVIDER PAGE */}
          <Route
            path="/p/:slug"
            element={<PublicProvider openLogin={openLogin} />}
          />

          {/* ✅ SINGLE BOOKING ROUTE */}
          <Route path="/book/:providerId" element={<BookingForm />} />

          {/* My bookings */}
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
