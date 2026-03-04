import React, { useState } from 'react';
import { X, Camera, Image, FileText } from 'lucide-react';
import './FileUploadModal.css';

const FileUploadModal = ({ onClose, onUpload }) => {
  const handleFileSelect = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'gallery') {
      input.accept = 'image/*';
    } else if (type === 'camera') {
      input.accept = 'image/*';
      input.capture = 'environment';
    } else {
      input.accept = '*/*';
      input.multiple = true;
    }
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      const processedFiles = files.map(file => ({
        file,
        name: file.name,
        type: file.type,
        preview: URL.createObjectURL(file),
        isImage: file.type.startsWith('image/')
      }));
      
      onUpload(processedFiles);
    };
    
    input.click();
  };

  return (
    <div className="file-upload-overlay-small" onClick={onClose}>
      <div className="file-upload-popup" onClick={e => e.stopPropagation()}>
        <button 
          className="upload-option-btn"
          onClick={() => handleFileSelect('gallery')}
        >
          <Image size={20} style={{ color: '#3b82f6' }} />
          <span>Gallery</span>
        </button>
        
        <button 
          className="upload-option-btn"
          onClick={() => handleFileSelect('camera')}
        >
          <Camera size={20} style={{ color: '#10b981' }} />
          <span>Camera</span>
        </button>
        
        <button 
          className="upload-option-btn"
          onClick={() => handleFileSelect('files')}
        >
          <FileText size={20} style={{ color: '#f59e0b' }} />
          <span>Files</span>
        </button>
      </div>
    </div>
  );
};

export default FileUploadModal;
