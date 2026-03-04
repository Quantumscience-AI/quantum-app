import React from 'react';
import { WifiOff } from 'lucide-react';
import './NetworkModal.css';

const NetworkModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="network-modal-overlay">
      <div className="network-modal">
        <div className="network-icon-wrapper">
          <WifiOff size={48} className="network-icon" />
        </div>
        <h3>No Internet Connection</h3>
        <p>Please check your connection and try again.</p>
        <button className="network-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default NetworkModal;
