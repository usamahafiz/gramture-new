import React from 'react';
import { Footer } from 'antd/es/layout/layout';
import TestimonialsSection from '../../components/testimonial';
import FeaturedClasses from '../../components/classes';
import Hero from '../../components/hero';
import Header from '../../components/header';


function Home() {
  return (
    <>
    
    <div className="app-container">
      <Header />
      <main className='main-content'>
        <Hero />
        <FeaturedClasses />
        <TestimonialsSection />      
      </main>  
    <Footer />
        
   

      
    </div>
    </>
  );
}
export default Home;