import React from "react";

function Pallete({ colors }) {
  return (
    <div>
      <p>Color Palette:</p>
      <div style={{ display: "flex", margin: "10px 0px" }}>
        {colors?.length > 0 ? (
          colors?.map((color, index) => (
            <div
              key={index}
              style={{
                backgroundColor: color,
                width: "38px",
                height: "38px",
                marginRight: "10px",
                borderRadius: "22px",
              }}
            ></div>
          ))
        ) : (
          <p>No colors available</p>
        )}
      </div>
    </div>
  );
}

export default Pallete;
