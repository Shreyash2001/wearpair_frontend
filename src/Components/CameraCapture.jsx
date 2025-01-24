import React, { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { stepsToUnlockCamera } from "../utils/utility";

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
  const [cameraPermission, setCameraPermission] = useState(0); // 0 - Not asked, 1 - Allowed, 2 - Denied
  const [userCameraSelection, setUserCameraSelection] = useState("environment");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open the camera
  const startWebCam = async (facingMode = "environment") => {
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
    if (cameraPermission === 0) {
      navigator.permissions
        .query({ name: "camera" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            setCameraPermission(1);
          }
          if (permissionStatus.state === "denied") {
            setCameraPermission(2);
          }
          permissionStatus.onchange = () => {
            setCameraPermission(permissionStatus.state);
          };
        });
    }
  }, []);

  useEffect(() => {
    if (open) {
      startWebCam();
    } else {
      stopWebCam();
    }
  }, [open]);

  const showCapturedImageSection = () => {
    return (
      <div style={{ padding: "10px" }}>
        <div className="captured-image-wrapper">
          <img src={capturedImage} alt="Captured" className="captured-image" />
        </div>
        <div style={{ marginTop: "20px" }}>
          <Button
            className={
              loading ? "findmatch_button_disabled" : "findmatch_button"
            }
            disabled={loading}
            onClick={uploadImage}
            variant="contained"
          >
            Find Match
          </Button>
          <Button
            className="findmatch_cancel_button"
            onClick={() => {
              setCapturedImage(null);
              startWebCam();
            }}
          >
            Retake Photo
          </Button>
        </div>
      </div>
    );
  };

  const showVideoSection = () => {
    return (
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
          <IconButton onClick={capturePhoto} className="camera-capture-button">
            <CameraAltIcon style={{ color: "#fff", fontSize: "35px" }} />
          </IconButton>
          <IconButton onClick={handleCameraToggle}>
            <FlipCameraAndroidIcon
              style={{ color: "#fff", fontSize: "35px" }}
            />
          </IconButton>
        </div>
      </div>
    );
  };

  const showPermissionDetails = () => {
    return (
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          style={{
            width: "90px",
            height: "90px",
            objectFit: "contain",
            margin: "10px 0px",
          }}
          src="images/camera-icon.png"
          alt=""
        />
        <h3>Camera Permission Required</h3>
        <p
          style={{
            textAlign: "center",
            color: "#8a8585",
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          To capture photos, please allow camera access by clicking on the
          camera icon in the address bar.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
            margin: "10px 0px",
          }}
        >
          <div>
            {stepsToUnlockCamera?.map((step, index) => (
              <div key={index} style={{ margin: "20px 0px" }}>
                <div style={{ display: "flex", margin: "5px 0px" }}>
                  <h4>{step?.step}</h4>
                  <h4 style={{ margin: "0px 5px" }}>{step?.title}</h4>
                </div>
                <p style={{ color: "#8a8585" }}>{step?.description}</p>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={onClose} className="findmatch_cancel_button">
          Close
        </Button>
      </div>
    );
  };

  return (
    <Modal open={open} onClose={(e, reason) => onClose(reason)}>
      <Box sx={cameraCaptureModalStyle}>
        {cameraPermission === 2
          ? showPermissionDetails()
          : capturedImage
          ? showCapturedImageSection()
          : showVideoSection()}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width={300}
          height={480}
        />
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
