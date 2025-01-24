import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CameraCapture from "../components/CameraCapture";
import ImageUploadBox from "../components/ImageUploadBox";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { outfitDetailsAction } from "../actions/outfitActions";
import { useDispatch, useSelector } from "react-redux";

function HomePage() {
  const dispatch = useDispatch();
  const { loading, success, outfitDetails } = useSelector(
    (state) => state.outfitDetails
  );
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [open, setOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openCameraModal, setOpenCameraModal] = useState(false);

  const handleOpenCameraModal = () => setOpenCameraModal(true);
  const handleCloseCameraModal = (reason) => {
    if (reason !== "escapeKeyDown" && reason !== "backdropClick") {
      setOpenCameraModal(false);
    }
  };
  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleMouseMove = () => {
    setShowControls(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timeout to hide controls
    timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timeout to hide controls
    timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const videoComponent = () => {
    return (
      <div className="video-container" onMouseMove={handleMouseMove}>
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/cqn/video/upload/v1657642879/gbg35wghwccd8uskknqk.mp4"
          autoPlay
          loop
          muted
          className="styled-video"
          playsInline
        />
        {showControls && (
          <div className="play-pause-btn" onClick={togglePlayPause}>
            {isPlaying ? (
              <PauseCircleIcon style={{ fontSize: "44px", color: "#fff" }} />
            ) : (
              <PlayCircleIcon style={{ fontSize: "44px", color: "#fff" }} />
            )}
          </div>
        )}
      </div>
    );
  };

  const handleMatchNowClick = async () => {
    if (selectedImage) {
      dispatch(outfitDetailsAction(selectedImage));
    }
  };

  const handleCancelClick = () => {
    setSelectedImage(null);
    setReset(true);
  };

  useEffect(() => {
    if (selectedImage) {
      setReset(false);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (success) {
      handleOpen();
    }
  }, [success]);

  console.log(open);

  const imageBoxDetails = () => {
    return (
      <div className="imageBoxDetails_main_container">
        <h1
          style={{
            textAlign: "center",
            fontSize: "36px",
            marginBottom: "20px",
          }}
        >
          Find <span className="gradient-text"> Matching Pair Now</span>
        </h1>
        <ImageUploadBox
          setSelectedImage={setSelectedImage}
          loading={loading}
          onReset={reset}
        />
        <div style={{ width: "100%" }}>
          {selectedImage && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                margin: "10px 20px",
              }}
            >
              <Button onClick={handleMatchNowClick} className="matchnow_button">
                Match Now
              </Button>
              <Button
                onClick={handleCancelClick}
                className="matchnow_cancel_button"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getOrLine = () => {
    return (
      <div style={{ width: "100%" }}>
        <div className="or_line">
          <hr />
          <p>Or</p>
          <hr />
        </div>
      </div>
    );
  };

  const handleCaptureNowClick = () => {
    handleOpenCameraModal();
  };

  const getCaptureNowButton = () => {
    return (
      <div style={{ padding: "15px 20px" }}>
        {selectedImage !== null && (
          <p style={{ color: "#fff", fontSize: "12px", margin: "5px 0px" }}>
            *Click cancel above to Enable Capture
          </p>
        )}
        <Button
          onClick={handleCaptureNowClick}
          disabled={selectedImage !== null ? true : false}
          className={`${
            selectedImage !== null
              ? "capturenow_button_disabled"
              : "capturenow_button"
          }`}
        >
          Capture Now
        </Button>{" "}
      </div>
    );
  };

  const topDetails = () => {
    return (
      <div className="topDetails_main_container">
        <h1 style={{ textAlign: "center", fontSize: "36px" }}>
          Let's Plan Your{" "}
          <span className="gradient-text">Matching Outfit For Today</span>
        </h1>
        <div className="topDetails_subtitle_text">
          <p>
            Discover the future of effortless styling. Let AI simplify outfit
            matching and elevate your wardrobe choices.
          </p>
        </div>
        {videoComponent()}
        <div style={{ margin: "30px 0px" }}>
          {imageBoxDetails()}
          {!isIOS && (
            <>
              {getOrLine()}
              {getCaptureNowButton()}
            </>
          )}
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p style={{ color: "#222" }}>
              {JSON.stringify(outfitDetails?.outfit, null, 2)}
            </p>
          </Box>
        </Modal>

        <CameraCapture
          open={openCameraModal}
          onClose={(reason) => handleCloseCameraModal(reason)}
        />
      </div>
    );
  };
  return <div className="homepage_main_container">{topDetails()}</div>;
}

export default HomePage;
