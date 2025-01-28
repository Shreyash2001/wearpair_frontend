import React, { useState } from "react";

const ReadMoreLess = ({ text = "", maxLength }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  // Inline styles
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#333",
    margin: "5px 0",
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "#007bff",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "5px",
    textDecoration: "underline",
    transition: "color 0.2s ease-in-out",
  };

  const buttonHoverStyle = {
    color: "#0056b3",
  };

  return (
    <div style={containerStyle}>
      <p>
        {expanded ? text : `${text.slice(0, maxLength)}...`}
        {text?.length > maxLength && (
          <button
            onClick={toggleReadMore}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.color = buttonHoverStyle.color)}
            onMouseOut={(e) => (e.target.style.color = buttonStyle.color)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
    </div>
  );
};

export default ReadMoreLess;
