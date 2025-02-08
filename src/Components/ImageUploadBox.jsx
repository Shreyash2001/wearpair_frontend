import React, { useEffect, useState } from "react";
import "./ImageUploadBox.css";
import CollectionsIcon from "@mui/icons-material/Collections";
import Loader from "./Loading";

const ImageUploadBox = ({ setSelectedImage, loading, onReset }) => {
  // console.log(onReset);
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
      reader.onload = () => {
        setImagePreview(reader.result);
        setSelectedImage(reader.result);
      };
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
    const fileInput = document.getElementById("fileInput");
    fileInput.value = null;
    fileInput.click();
  };

  useEffect(() => {
    if (onReset) {
      setImagePreview(null);
    }
  }, [onReset]);

  const [borderAngle, setBorderAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBorderAngle((prev) => (prev + 1) % 360);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        border: loading ? "3px solid transparent" : "none",
        borderRadius: loading ? "22px" : "none",
        background: loading
          ? `conic-gradient(from ${borderAngle}deg,rgb(248, 137, 137),rgb(248, 153, 153) 5%,rgb(247, 152, 152) 60%,rgb(238, 93, 93) 95%) padding-box,
                 conic-gradient(from ${borderAngle}deg, transparent 25%,rgb(245, 79, 79),rgb(224, 75, 75) 99%, transparent) border-box,
                 conic-gradient(from ${borderAngle}deg,rgb(243, 135, 150),rgba(238, 139, 139, 0.99) 5%,rgb(247, 135, 135) 60%,rgb(247, 120, 120) 95%) border-box`
          : "none",
        transition: loading ? "border-angle 0.1s linear" : "none",
        margin: "10px 0px",
      }}
    >
      <div
        onClick={handleBoxClick}
        className="upload-box"
        style={{ border: `${loading ? "none" : "3px dashed #ff8f8f"}` }}
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
              backgroundColor: "black",
              width: "100%",
              height: "300px",
              justifyContent: "center",
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
        {loading && (
          <div className="analysing_preview">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadBox;
