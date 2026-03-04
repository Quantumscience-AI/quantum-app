import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowModal(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowModal(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAndShowModal = () => {
    if (!isOnline) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  return { isOnline, showModal, setShowModal, checkAndShowModal };
};
