import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show alert initially if offline
    if (!navigator.onLine) {
      setShowOfflineAlert(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide the offline alert after some time when back online
  useEffect(() => {
    if (isOnline && showOfflineAlert) {
      const timer = setTimeout(() => {
        setShowOfflineAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineAlert]);

  if (!showOfflineAlert && isOnline) {
    return null;
  }

  return (
    <Alert 
      variant={isOnline ? "success" : "warning"} 
      className="position-fixed top-0 start-50 translate-middle-x mt-3"
      style={{ zIndex: 1050, minWidth: '300px' }}
      dismissible={isOnline}
      onClose={() => setShowOfflineAlert(false)}
    >
      <div className="d-flex align-items-center">
        {isOnline ? (
          <>
            <FaWifi className="me-2" />
            <span>Connection restored!</span>
          </>
        ) : (
          <>
            <FaExclamationTriangle className="me-2" />
            <span>You're offline. Some features may not work properly.</span>
          </>
        )}
      </div>
    </Alert>
  );
};

export default NetworkStatus;
