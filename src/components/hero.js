import React, { useState, useEffect } from "react";
import "../assets/css/hero.css";
import heroImage from "../assets/images/heroimg.png";
import { FaSearch } from "react-icons/fa";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import img3 from "../assets/images/dear departed.jpg";
import img1 from "../assets/images/10.jpg";
import img2 from "../assets/images/11.jpg";
import img4 from "../assets/images/12.jpg";
import img5 from "../assets/images/mr chips.jpg";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allWords, setAllWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [topics, setTopics] = useState([]);

  const images = [img3, img1, img2, img4, img5];

  // Extract all visible words from the DOM
  const extractTextWordsFromDOM = () => {
    const bodyText = document.body.innerText || "";
    const words = bodyText
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
      .filter((w) => w.length > 2);
    const uniqueWords = [...new Set(words)];
    setAllWords(uniqueWords);
  };

  // Fetch topics from Firebase
  const fetchTopicsFromFirebase = async () => {
    try {
      const topicsRef = collection(db, "topics");
      const snapshot = await getDocs(topicsRef);
      const topicList = snapshot.docs.map((doc) => doc.data());
      setTopics(topicList);
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  useEffect(() => {
    extractTextWordsFromDOM();
    fetchTopicsFromFirebase();
  }, []);

  // Highlight word in DOM
  const highlightWordInDOM = (targetWord) => {
    document.querySelectorAll(".search-target").forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.innerText), el);
      parent.normalize();
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const regex = new RegExp(`\\b(${targetWord})\\b`, "i");

    let node;
    while ((node = walker.nextNode())) {
      const match = node.nodeValue.match(regex);
      if (match) {
        const span = document.createElement("span");
        span.className = "search-target high";
        span.textContent = match[0];

        const before = node.nodeValue.slice(0, match.index);
        const after = node.nodeValue.slice(match.index + match[0].length);

        const beforeNode = document.createTextNode(before);
        const afterNode = document.createTextNode(after);

        const parent = node.parentNode;
        parent.replaceChild(afterNode, node);
        parent.insertBefore(span, afterNode);
        parent.insertBefore(beforeNode, span);

        span.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
    }
  };

  // Search suggestions
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.length > 1) {
      const textMatches = allWords
        .filter((word) => word.includes(value))
        .slice(0, 5);

      const topicMatches = topics
        .filter((topic) => topic.name.toLowerCase().includes(value))
        .slice(0, 5)
        .map((topic) => ({ name: topic.name, url: topic.url, isTopic: true }));

      const mergedSuggestions = [
        ...textMatches.map((word) => ({ name: word, isTopic: false })),
        ...topicMatches,
      ];

      setSuggestions(mergedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm(item.name);
    setSuggestions([]);
    if (item.isTopic) {
      window.open(item.url, "_blank");
    } else {
      highlightWordInDOM(item.name);
    }
  };

  return (
    <section className="hero mt-5 mb-3">
      <div className="hero-content">
        <h1>
          Learn <span style={{ color: "grey" }}>today.</span>{" "}
          <span style={{ color: "grey" }}>Lead</span> tomorrow
        </h1>
        <p>
          Gramture is a transformative platform for students seeking to learn efficiently and excel academically.
        </p>

        <div className="btn-contact">
          <button className="contact-btn">Contact Now</button>
        </div>
 
      </div>

      <div className="hero-image">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={800}
          showStatus={false}
          showArrows
          showIndicators
          stopOnHover
          swipeable
          emulateTouch
        >
          {images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Slide ${index}`} className="carousel-img" />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Hero;
