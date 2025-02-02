import React, { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import { stepsToUnlockCamera } from "../utils/utility";
import { useDispatch } from "react-redux";
import { outfitDetailsAction } from "../actions/outfitActions";
import Loader from "./Loading";

function CameraCapture({ open, onClose, loading }) {
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
  const dispatch = useDispatch();
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(0); // 0 - Not asked, 1 - Allowed, 2 - Denied
  const [userCameraSelection, setUserCameraSelection] = useState("environment");

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
    if (capturedImage) {
      dispatch(outfitDetailsAction(capturedImage));
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

  const handleClose = () => {
    onClose(); // Call the onClose function passed as a prop
    stopWebCam(); // Call your additional function
  };

  useEffect(() => {
    if (open) {
      startWebCam();
    } else {
      stopWebCam();
    }
  }, [open]);

  const [borderAngle, setBorderAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBorderAngle((prev) => (prev + 1) % 360);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const showCapturedImageSection = () => {
    return (
      <div style={{ padding: "10px" }}>
        <div
          style={{
            border: loading ? "3px solid transparent" : "2px solid #ff8f8f",
            borderRadius: loading ? "22px" : "none",
            background: loading
              ? `conic-gradient(from ${borderAngle}deg,rgb(248, 137, 137),rgb(248, 153, 153) 5%,rgb(247, 152, 152) 60%,rgb(238, 93, 93) 95%) padding-box,
                   conic-gradient(from ${borderAngle}deg, transparent 25%,rgb(245, 79, 79),rgb(224, 75, 75) 99%, transparent) border-box,
                   conic-gradient(from ${borderAngle}deg,rgb(243, 135, 150),rgba(238, 139, 139, 0.99) 5%,rgb(247, 135, 135) 60%,rgb(247, 120, 120) 95%) border-box`
              : "none",
            transition: loading ? "border-angle 0.1s linear" : "none",
            position: "relative",
          }}
          className="captured-image-wrapper"
        >
          <img src={capturedImage} alt="Captured" className="captured-image" />
          {loading && (
            <div className="analysing_preview">
              <Loader />
            </div>
          )}
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
            style={{
              width: "100%",
              height: "75vh",
              objectFit: "cover",
            }}
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
            bottom: "50px",
          }}
        >
          <IconButton onClick={handleClose}>
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
  );
}

export default CameraCapture;
