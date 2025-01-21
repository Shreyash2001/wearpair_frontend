import React from "react";

const ClothingSuggestion = ({ data }) => {
  console.log(data);
  const renderColorCircles = (hexCodes) => {
    return hexCodes.split(",").map((color, index) => (
      <div
        key={index}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: color.trim(),
          border: "1px solid #ccc",
          margin: "5px",
        }}
        title={color.trim()} // Displays hex code on hover
      ></div>
    ));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "10px" }}>Clothing Suggestions</h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>What have you worn:</h3>
        <p>{data?.clothing_item}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Primary Color:</h3>
        <p>{data?.primary_color}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Complementary Suggestions:</h3>
        <div>
          <h4>Shirts:</h4>
          <p>{data?.complementary_colors?.shirts}</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {renderColorCircles(data?.hex_codes.shirts)}
          </div>
        </div>
        <div>
          <h4>Pants:</h4>
          <p>{data?.complementary_colors.pants}</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {renderColorCircles(data?.hex_codes.pants)}
          </div>
        </div>
        <div>
          <h4>Jackets:</h4>
          <p>{data?.complementary_colors.jackets}</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {renderColorCircles(data?.hex_codes.jackets)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingSuggestion;
