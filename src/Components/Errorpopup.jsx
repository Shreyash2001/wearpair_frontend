import React, { createContext, useContext, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  console.log(error);
  const showError = (message) => setError(message);
  const hideError = () => setError(null);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "#222",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      <Modal open={Boolean(error)} onClose={hideError}>
        <Box sx={style}>
          <Typography variant="h6" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" color="error" onClick={hideError}>
            Close
          </Button>
        </Box>
      </Modal>
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
