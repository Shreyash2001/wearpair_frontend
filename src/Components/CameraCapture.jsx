import React, { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

function CameraCapture({ open, onClose }) {
  const cameraCaptureModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: "90vh",
    bgcolor: "#0d0d0d",
    border: "2px solid #000",
    boxShadow: 24,
    padding: 1,
    borderRadius: 5,
  };
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [userCameraSelection, setUserCameraSelection] = useState("environment");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open the camera
  const startWebCam = async (facingMode = "environment") => {
    console.log(userCameraSelection);
    if (mediaStream) {
      // Stop the current stream before switching cameras
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
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
    console.log("stopWebCam");
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

  const handleCameraToggle = async () => {
    const newFacingMode =
      userCameraSelection === "user" ? "environment" : "user";
    setUserCameraSelection(newFacingMode);
    await startWebCam(newFacingMode);
  };

  useEffect(() => {
    if (open) {
      startWebCam();
    } else {
      stopWebCam();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={cameraCaptureModalStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <video
              style={{ width: "100%", height: "75vh", objectFit: "cover" }}
              ref={videoRef}
              autoPlay
              muted
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon style={{ color: "#fff", fontSize: "35px" }} />
            </IconButton>
            <IconButton className="camera-capture-button">
              <CameraAltIcon style={{ color: "#fff", fontSize: "35px" }} />
            </IconButton>
            <IconButton onClick={handleCameraToggle}>
              <FlipCameraAndroidIcon
                style={{ color: "#fff", fontSize: "35px" }}
              />
            </IconButton>
          </div>
        </div>
      </Box>
    </Modal>
    // <div>
    //   <h2>Capture Photo</h2>
    //   {
    //     <div style={{ margin: "10px 0px" }}>
    //       <button onClick={handleCameraToggle}>Toggle Camera</button>
    //     </div>
    //   }
    //   {!capturedImage && <button onClick={startWebCam}>Open Camera</button>}

    //   {
    //     <div>
    //       <video
    //         style={{ width: "300px", height: "300px" }}
    //         ref={videoRef}
    //         autoPlay
    //         muted
    //       />
    //     </div>
    //   }
    //   <button onClick={capturePhoto}>Capture Photo</button>
    //   <button onClick={stopWebCam}>Close Camera</button>

    //   {capturedImage && (
    //     <div>
    //       <h3>Captured Photo:</h3>
    //       <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
    //       <Button disabled={loading} onClick={uploadImage} variant="contained">
    //         Upload Photo
    //       </Button>
    //       <button onClick={() => setCapturedImage(null)}>Retake Photo</button>
    //     </div>
    //   )}

    //   {/* Hidden canvas for capturing photo */}
    //   <canvas
    //     ref={canvasRef}
    //     style={{ display: "none" }}
    //     width={300}
    //     height={480}
    //   />
    //   {response && (
    //     <div style={{ marginTop: "20px" }}>
    //       {/* <ClothingSuggestion data={response} /> */}
    //       <h3>Response:</h3>
    //       <p>{JSON.stringify(response, null, 2)}</p>
    //     </div>
    //   )}
    //   <div>
    //     <button onClick={reset}>Reset</button>
    //   </div>
    // </div>
  );
}

export default CameraCapture;
