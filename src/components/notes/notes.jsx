import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fireStore } from "../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../../assets/css/notes.css";

const Notes = () => {
  const { selectedClass } = useParams();
  const navigate = useNavigate();

  const [subCategories, setSubCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const snapshot = await getDocs(collection(fireStore, "subcategories"));
      const subList = snapshot.docs.map((doc) => doc.data());
      setSubCategories(subList);
      console.log("Subcategories fetched:", subList);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchTopics = async (subcategory) => {
    if (!selectedClass || !subcategory) return;

    setLoading(true);
    setTopics([]);

    try {
      const q = query(
        collection(fireStore, "topics"),
        where("class", "==", `Class ${selectedClass}`),
        where("subCategory", "==", subcategory)
      );

      const snapshot = await getDocs(q);
      const topicsList = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.topic) {
          topicsList.push({
            id: doc.id,
            name: data.topic,
            fileUrls: data.notesFile || [],
            description: data.description || "",
          });
        }
      });

      setTopics(topicsList);
      console.log("Topics fetched:", topicsList);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
    setLoading(false);
  };

  const handleSubcategorySelect = (subcategory) => {
    console.log("Subcategory selected:", subcategory);
    setSelectedSubcategory(subcategory);
    setShowSubcategoryDropdown(false);
    fetchTopics(subcategory);
  };

  const handleTopicClick = (topic) => {
    const fileData = topic.notesFile || topic.fileUrls || "";
    let fileUrl = "";

    if (typeof fileData === "string") {
      fileUrl = fileData;
    } else if (fileData && typeof fileData === "object") {
      fileUrl = fileData.url || fileData.fileUrl || "";
    }

    if (fileUrl && typeof fileUrl === "string") {
      navigate(`/preview?url=${encodeURIComponent(fileUrl)}`);
    } else {
      console.warn("No valid file URL found for topic:", topic.name);
    }
  };

  const handleDescriptionClick = (topic) => {
    const id = encodeURIComponent(topic.id);
    const name = encodeURIComponent(topic.name || "Untitled");
    const description = encodeURIComponent(topic.description || "");

    navigate(`/description?id=${id}&name=${name}&description=${description}`);
  };

  return (
    <div className="notes-container" style={{ marginTop: "20px" }}>
      <main>
        <h2 className="text-center">Educational Portal - {selectedClass}</h2>
        <p className="intro-text">
          Select a subcategory to view available topics.
        </p>

        <div className="selection-container">
          <div className="dropdown-wrapper">
            <label className="dropdown-label">Select Subcategory:</label>
            <div className="custom-dropdown">
              <div
                className={`dropdown-header ${
                  showSubcategoryDropdown ? "active" : ""
                }`}
                onClick={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
              >
                <span>
                  {selectedSubcategory || "Choose a subcategory..."}
                </span>
                <span className="dropdown-arrow">
                  {showSubcategoryDropdown ? "▲" : "▼"}
                </span>
              </div>

              {showSubcategoryDropdown && (
                <div className="dropdown-options">
                  {subCategories.map((subcategory, index) => (
                    <div
                      key={index}
                      className={`dropdown-option ${
                        selectedSubcategory === subcategory.name ? "selected" : ""
                      }`}
                      onClick={() => handleSubcategorySelect(subcategory.name)}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedSubcategory && (
          <div className="topics-section">
            <h3>Topics for Subcategory → {selectedSubcategory}</h3>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Loading topics...</span>
              </div>
            ) : topics.length > 0 ? (
              <div className="topics-grid">
                {topics.map((topic, index) => (
                  <div key={index} className="topic-card">
                    <div className="topic-icon">📚</div>
                    <div className="topic-name">{topic.name}</div>
                    <div className="topic-files">
                      {topic.fileUrls?.length || 0} files
                    </div>
                    <div className="topic-actions">
                      <button onClick={() => handleDescriptionClick(topic)}>
                        Description
                      </button>
                      <button onClick={() => handleTopicClick(topic)}>
                        Preview File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-topics-message">
                <div className="no-topics-icon">📝</div>
                <p>No topics found for this subcategory.</p>
                <small>Try selecting a different subcategory.</small>
              </div>
            )}
          </div>
        )}

        {!selectedSubcategory && (
          <div className="instructions">
            <h3>How to use:</h3>
            <ol>
              <li>Select a <strong>Subcategory</strong> from the dropdown above</li>
              <li>Browse the <strong>Topics</strong> that will be displayed</li>
              <li>Click on any topic to view the content</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
