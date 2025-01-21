import React, { useState } from "react";
import "./ImageUploadBox.css";
import CollectionsIcon from "@mui/icons-material/Collections";

const ImageUploadBox = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleBoxClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div
      onClick={handleBoxClick}
      className="upload-box"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {imagePreview ? (
        <img src={imagePreview} alt="Preview" className="image-preview" />
      ) : (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CollectionsIcon
            style={{ color: "#fff", fontSize: "50px", marginBottom: "10px" }}
          />
          <label className="upload-label">
            Drag & drop an image here <br /> or <span>click to select</span>
          </label>
        </div>
      )}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUploadBox;
