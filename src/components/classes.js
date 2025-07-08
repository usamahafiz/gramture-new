import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/classes.css';
import class9 from '../assets/images/9 class.jpg';
import class10 from '../assets/images/class 10.png';
import class11 from '../assets/images/class 11.png';
import class12 from '../assets/images/class 12.png';

const FeaturedClasses = () => {
  const navigate = useNavigate();

  const handleCardClick = (classNumber) => {
    navigate(`/notes/${classNumber}`);
  };

  return (
    <section className="featured-section">
      <div className="featured-container">
        {/* Heading */}
        <div className="top-text-center">
          <div className="heading-wrapper">
            <h2 className="section-heading">Featured Classes</h2>
            <div className="gradient-underline"></div>
          </div>
          <p className="description">
            Explore expertly crafted courses, tailored content, and interactive tools to empower your learning journey online.
            Unlock your potential with immersive lessons, real-world applications, and a community that grows with you.
          </p>
        </div>

        {/* Class Cards */}
        <div className="horizontal-card-container">
          <div className="class-card" onClick={() => handleCardClick("9")}>
            <img src={class9} alt="Class 9" className="class-image" />
            <h3>Class 9</h3>
            <ul>
              <li>Notes</li>
              <li>Past Papers</li>
              <li>Guess Papers</li>
              <li>MCQs Test</li>
            </ul>
          </div>

          <div className="class-card" onClick={() => handleCardClick("10")}>
            <img src={class10} alt="Class 10" className="class-image" />
            <h3>Class 10</h3>
            <ul>
              <li>Notes</li>
              <li>Past Papers</li>
              <li>Guess Papers</li>
              <li>MCQs Test</li>
            </ul>
          </div>

          <div className="class-card" onClick={() => handleCardClick("11")}>
            <img src={class11} alt="Class 11" className="class-image" />
            <h3>Class 11</h3>
            <ul>
              <li>Notes</li>
              <li>Past Papers</li>
              <li>Guess Papers</li>
              <li>MCQs Test</li>
            </ul>
          </div>

          <div className="class-card" onClick={() => handleCardClick("12")}>
            <img src={class12} alt="Class 12" className="class-image" />
            <h3>Class 12</h3>
            <ul>
              <li>Notes</li>
              <li>Past Papers</li>
              <li>Guess Papers</li>
              <li>MCQs Test</li>
            </ul>
          </div>
        </div>

        {/* Recent Section */}
        <div className="recent-section">
          <div className="heading-wrapper">
            <h2 className="section-heading">Recents</h2>
            <div className="gradient-underline"></div>
          </div>
          <p className="description">Coming soon — recently added resources will appear here.</p>
          <div className="recent-placeholder">🔧 This section will be populated with Firebase data.</div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedClasses;