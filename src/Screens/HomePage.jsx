import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CameraCapture from "../components/CameraCapture";
import ImageUploadBox from "../components/ImageUploadBox";
import { Button } from "@mui/material";
import {
  clearSessionStorage,
  outfitDetailsAction,
} from "../actions/outfitActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useError } from "../components/Errorpopup";
import { motion, AnimatePresence } from "framer-motion";

const occasionWords = ["Date Wear", "Party Wear", "Trip Wear"];

const ShowOccasionTitle = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % occasionWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: "0px 30px" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px" }}>
        Plan Your <span className="gradient-text">Next </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={occasionWords[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="gradient-text"
            style={{ marginLeft: "20px" }}
          >
            {occasionWords[index]}
          </motion.span>
        </AnimatePresence>
      </h1>
    </div>
  );
};

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, outfit, error } = useSelector(
    (state) => state.outfitDetails
  );
  const { showError } = useError();
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

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

  useEffect(() => {
    if (error) {
      showError(
        "Our Modal is currently Busy. Please Wait for few Minutes and Try Again."
      );
    }
  }, [error]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    clearSessionStorage();
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
      // handleOpen();
      navigate(`/outfit/${outfit?.id}`);
    }
  }, [success]);

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
          {selectedImage && (
            <div style={{ margin: "10px 0px" }}>
              <h4>
                *We do not save your images. Data is Autodeleted after
                suggestions
              </h4>
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

        <CameraCapture
          open={openCameraModal}
          onClose={(reason) => handleCloseCameraModal(reason)}
          loading={loading}
        />
      </div>
    );
  };

  const getOccassionSection = () => {
    return (
      <div>
        <ShowOccasionTitle />
      </div>
    );
  };

  return (
    <div className="homepage_main_container">
      {topDetails()}
      {getOccassionSection()}
    </div>
  );
}

export default HomePage;
