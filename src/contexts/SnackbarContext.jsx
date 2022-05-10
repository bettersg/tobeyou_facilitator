import React, { useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const SnackbarContext = React.createContext(null);

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    message: '',
    open: false,
    type: 'error',
  });

  const handleClose = () => {
    setSnackbar({
      ...snackbar,
      message: '',
      open: false,
    });
  };

  const value = { setSnackbar };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        onClose={handleClose}
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar.type || 'error'}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
