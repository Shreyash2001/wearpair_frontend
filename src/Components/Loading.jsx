import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Finding the best match for your outfit...",
  "Analyzing color combinations...",
  "Scanning trending styles...",
  "Matching with fashion trends...",
  "Finalizing your outfit recommendation...",
];

const Loader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analysing_preview">
      <AnimatePresence mode="wait">
        <motion.p
          key={messages[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", fontSize: "14px" }}
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default Loader;
