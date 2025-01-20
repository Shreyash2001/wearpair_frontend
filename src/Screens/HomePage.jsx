import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

function HomePage() {
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
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
      </div>
    );
  };
  return <div className="homepage_main_container">{topDetails()}</div>;
}

export default HomePage;
