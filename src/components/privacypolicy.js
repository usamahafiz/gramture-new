import React, { useEffect } from "react";
import '../assets/css/privacypolicy.css'; // Make sure this path matches your project structure

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-container">
      <h1 className="privacy-heading">Privacy Policy</h1>

      <p className="privacy-paragraph">
        At <strong>Gramture</strong>, we value your privacy and are fully committed to protecting the personal information of all users. Information such as names, emails, and usage patterns collected through our platform is used strictly to improve the educational experience and provide tailored content. We do not sell, trade, or share your personal data with any third parties unless legally required or with your prior consent.
      </p>

      <p className="privacy-paragraph">
        All content available on <strong>Gramture</strong>—including grammar lessons, notes, exercises, explanations, and user-generated contributions—is protected under copyright laws and intellectual property rights. Unauthorized copying, scraping, or redistribution of any material—whether manually or via automation—is strictly prohibited. Violators may be permanently banned and subject to legal action. Our systems regularly monitor suspicious activities to ensure a safe and ethical learning environment.
      </p>

      <p className="privacy-paragraph">
        By accessing and using Gramture, you agree to follow our terms of use and uphold our commitment to responsible educational sharing. We welcome reports of misuse, inappropriate behavior, or privacy violations via our support team. Gramture is dedicated to fostering a secure, respectful, and empowering platform for learners of all ages.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
