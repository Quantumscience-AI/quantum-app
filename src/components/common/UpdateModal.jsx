import React from 'react';
import { Download } from 'lucide-react';
import './UpdateModal.css';

const UpdateModal = ({ isOpen, message, playStoreUrl, forceUpdate, onClose }) => {
  if (!isOpen) return null;

  const handleUpdate = () => {
    window.open(playStoreUrl, '_blank');
  };

  return (
    <div className="update-modal-overlay">
      <div className="update-modal">
        <div className="update-icon">
          <Download size={40} />
        </div>
        <h3>Update Available</h3>
        <p>{message}</p>
        <div className="update-actions">
          <button className="update-btn-primary" onClick={handleUpdate}>
            Update Now
          </button>
          {!forceUpdate && (
            <button className="update-btn-secondary" onClick={onClose}>
              Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
