import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fireStore } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../assets/css/description.css";
import { Spin } from "antd";

const DescriptionPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const name = queryParams.get("name");
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      if (!name) return;

      setLoading(true);
      console.log(`Fetching description for topic: ${name}`);
      try {
        const q = query(
          collection(fireStore, "topics"),
          where("topic", "==", name)
        );
        const snapshot = await getDocs(q);
        console.log(`Found ${snapshot.size} topics matching "${name}"`);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          console.log("Topic data:", data);

          // ✅ Use top-level `description`
          setDescription(data.description || "<p>No description available.</p>");
        } else {
          setDescription("<p>No topic found.</p>");
        }
      } catch (error) {
        console.error("Error fetching topic description:", error);
        setDescription("<p>Error loading description.</p>");
      }
      setLoading(false);
    };

    fetchDescription();
  }, [name]);

  if (!name) {
    return <h2 style={{ textAlign: "center" }}>No topic name provided</h2>;
  }

  return (
    <div className="description-container" style={{ marginTop: "50px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
        {name}
      </h1>

      <article className="product-article">
        <div className="product-description">
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </div>
      </article>
    </div>
  );
};

export default DescriptionPage;

