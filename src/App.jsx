import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerHome from './pages/Customer/Home';
import ServiceCategories from './pages/Customer/ServiceCategories';
import ServiceProviders from './pages/Customer/ServiceProviders';
import BookingForm from './pages/Customer/BookingForm';
import BookProvider from './pages/Customer/BookProvider';
import MyBookings from './pages/Customer/MyBookings';
import RentalsHome from './pages/Rentals/RentalsHome';
import RentalsCategory from './pages/Rentals/RentalCatagories';
import RentalBookingForm from './pages/Rentals/RentalBookingForm';
import MyRentalBookings from './pages/Customer/RentalMyBookings';
import LoginModal from './components/LoginModal';

import './App.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <div className="App">
      <Navbar />
      {showLogin && <LoginModal onClose={closeLogin} />}
      <main>
        <Routes>
          {/* Home Service */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/services" element={<ServiceCategories openLogin={openLogin} />} />
          <Route path="/services/:category" element={<ServiceProviders />} />
          <Route path="/book/:providerId" element={<BookingForm />} />
          <Route path="/book/:id" element={<BookProvider />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Rentals */}
          <Route path="/rentals" element={<RentalsHome />} />
          <Route path="/rentals/:categoryId" element={<RentalsCategory />} />
          <Route path="/rental-booking/:id" element={<RentalBookingForm />} />
          <Route path="/my-rental-bookings" element={<MyRentalBookings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
