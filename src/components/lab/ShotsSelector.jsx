import React from 'react';
import { X } from 'lucide-react';
import './ShotsSelector.css';

const ShotsSelector = ({ isOpen, onClose, currentShots, onSelect }) => {
  if (!isOpen) return null;

  const shotsOptions = [100, 256, 512, 1024, 2048, 4096, 8192];

  return (
    <div className="shots-selector-overlay" onClick={onClose}>
      <div className="shots-selector-modal" onClick={e => e.stopPropagation()}>
        <div className="shots-modal-header">
          <h3>Select Shots</h3>
          <button className="shots-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="shots-options">
          {shotsOptions.map(shots => (
            <label key={shots} className="shots-option">
              <input
                type="radio"
                name="shots"
                value={shots}
                checked={currentShots === shots}
                onChange={() => {
                  onSelect(shots);
                  onClose();
                }}
              />
              <span className="shots-radio"></span>
              <span className="shots-label">{shots} shots</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShotsSelector;
