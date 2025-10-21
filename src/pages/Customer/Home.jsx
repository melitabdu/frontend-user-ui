// src/pages/Customer/Home.jsx
import React from 'react';
import HeroSlider from '../../components/HeroSlider';
import ServiceCategories from './ServiceCategories';
import './Home.css';
import Footer from '../../components/Footer';
import AdvertisingSection from '../../components/AdvertisingSection';
import RentalsHome from '../Rentals/RentalsHome';

const CustomerHome = () => (
  <div className="home-container">
    <HeroSlider
      images={[
        'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
       
        
        'https://images.pexels.com/photos/6195124/pexels-photo-6195124.jpeg',
        'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg',
        'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
        'https://images.pexels.com/photos/4107098/pexels-photo-4107098.jpeg',
        'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg'
      ]}
    />

    <section id="services">
      <ServiceCategories />
    </section>
    <section id="rentals">
      <RentalsHome />
    </section>

    
    <section className="how-it-works-section">
      <h2>🛠️ እንዴት  እንደሚሰራ?</h2>
      <div className="steps-grid">
        <div className="step">
          <h3>1.የሚፈልጉትን አገልግሎቶችን የያዘዉን  ይጫኑ</h3>
          <p>የሚፈልጉትን አገልግሎትና ለአካባቢዎ የሚቀርበዉን ባለሞያ ይምረጡ </p>
        </div>
        <div className="step">
          <h3>2. ቀጥታ ቀጠሮ ያስይዙ</h3>
          <p>የሚመችዎትን ጊዜ እና አድራሻ ይምረጡ — ምንም መደወል የለቦትም።</p>
        </div>
        <div className="step">
          <h3>3. አገልግሎቱን ያግኙ</h3>
          <p>አቅራቢው በጊዜ ይደርሳል እና ስራውን በትክክል ይጨርሳል።</p>
        </div>
      </div>
    </section>

    <section className="testimonials-section">
      <h2>🌟 የደንበኞች ምስክሮች</h2>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <p>"አገልግሎቱ ጥሩ ነበር! የባንባ በለሞያው ፈጣን ነበር እና ባለሙያም ነበር።"</p>
          <p>- ሮዛ</p>
        </div>
        <div className="testimonial-card">
          <p>" online አገልግሎቶችን ማዘዝ  ቀላል ስለሆን በጣም እወደዋለሁ!"</p>
          <p>- ሳሙኤል</p>
        </div>
        <div className="testimonial-card">
          <p>"ለየቤት ጥገናና ማጽዳት እጅግ አስተማማኝ ነው።"</p>
          <p>- ፋጢማ</p>
        </div>
      </div>
    </section>

    <section className="contact-section">
      
      <AdvertisingSection />
      
      <Footer />
    </section>
  </div>
);

export default CustomerHome;
