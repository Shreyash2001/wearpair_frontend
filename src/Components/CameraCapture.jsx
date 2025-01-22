import React, { useRef, useState } from "react";
import ClothingSuggestion from "./ClothingSuggestion";
import { Button } from "@mui/material";

const CameraCapture = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [userCameraSelection, setUserCameraSelection] = useState("user");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open the camera
  const startWebCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: userCameraSelection,
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const stopWebCam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
  };

  // Capture a photo
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg"); // Base64 image data
        setCapturedImage(imageData);
        stopWebCam();
      }
    }
  };

  const reset = () => {
    stopWebCam();
    setCapturedImage(null);
  };

  // Handle image upload
  const uploadImage = async () => {
    setLoading(true);
    if (capturedImage) {
      const data = new FormData();
      const blob = await fetch(capturedImage).then((res) => res.blob());
      data.append("file", blob);
      data.append("upload_preset", "insta_clone");
      data.append("cloud_name", "cqn");
      fetch("https://api.cloudinary.com/v1_1/cqn/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then(async (uploadedData) => {
          console.log("Uploaded Image URL:", uploadedData.url);
          try {
            const backendRes = await fetch(
              "https://wearpair-backend.vercel.app/api/image-details/generate",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: uploadedData.url }),
              }
            );

            const backendData = await backendRes.json();
            setResponse(backendData);
            alert("Image uploaded successfully!");
            setLoading(false);
          } catch (error) {
            alert(error);
          }
        })
        .catch((err) => {
          console.error("Upload error:", err);
          alert("Failed to upload image.");
        });
    }
  };

  const handleCameraToggle = () => {
    setUserCameraSelection(
      userCameraSelection === "user" ? "environment" : "user"
    );
  };

  const detailsContainer = () => {
    return (
      <div style={{ margin: "20px 0px" }}>
        <div>
          <h3>What have you worn:</h3>
          <p>{response?.clothing_item}</p>
        </div>
        <div>
          <h3>Primary Colors</h3>
          <p>{response?.primary_color}</p>
        </div>
        <div>
          <h3>Shirts:</h3>
          {/* <div style={{ display: "flex", gap: "10px" }}>
            {response?.complementary_colors?.shirts?.map((color, index) => (
              <div
                key={index}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid #ccc",
                }}
                title={color} // Shows the hex code on hover
              ></div>
            ))}
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Capture Photo</h2>
      {
        <div style={{ margin: "10px 0px" }}>
          <button onClick={handleCameraToggle}>Toggle Camera</button>
        </div>
      }
      {!capturedImage && <button onClick={startWebCam}>Open Camera</button>}

      {
        <div>
          <video
            style={{ width: "300px", height: "300px" }}
            ref={videoRef}
            autoPlay
            muted
          />
        </div>
      }
      <button onClick={capturePhoto}>Capture Photo</button>
      <button onClick={stopWebCam}>Close Camera</button>

      {capturedImage && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
          <Button disabled={loading} onClick={uploadImage} variant="contained">
            Upload Photo
          </Button>
          <button onClick={() => setCapturedImage(null)}>Retake Photo</button>
        </div>
      )}

      {/* Hidden canvas for capturing photo */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={300}
        height={480}
      />
      {response && (
        <div style={{ marginTop: "20px" }}>
          {/* <ClothingSuggestion data={response} /> */}
          <h3>Response:</h3>
          <p>{JSON.stringify(response, null, 2)}</p>
        </div>
      )}
      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default CameraCapture;
