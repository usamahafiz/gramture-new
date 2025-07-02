import React from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/description.css";

import { Spin } from "antd";

const extractTextFromHTML = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

const DescriptionPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id");
  const name = queryParams.get("name") || "Untitled Topic";
  const rawDescription = queryParams.get("description") || "<p>No description available.</p>";

  const decodedDescription = decodeURIComponent(rawDescription);

  if (!id) {
    return <h2 style={{ textAlign: "center" }}>No product ID provided</h2>;
  }

  return (
    <div className="description-container" style={{ marginTop: "50px" }}>
      {/* <Helmet>
        <title>Gramture - {name}</title>
        <meta
          name="description"
          content={extractTextFromHTML(decodedDescription).substring(0, 150)}
        />
      </Helmet> */}

      <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
        {name}
      </h1>
      <article className="product-article">
        <div className="product-description">
          <div dangerouslySetInnerHTML={{ __html: decodedDescription }} />
        </div>
      </article>
    </div>
  );
};

export default DescriptionPage;
