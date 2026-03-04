import React from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import './MessageOptionsModal.css';

const MessageOptionsModal = ({ messageId, onClose, onEdit, onCopy }) => {
  return (
    <div className="message-options-overlay" onClick={onClose}>
      <div className="message-options-modal" onClick={e => e.stopPropagation()}>
        <button 
          className="message-option"
          onClick={() => onEdit(messageId)}
        >
          <MdEdit size={20} />
          <span>Edit</span>
        </button>
        
        <button 
          className="message-option"
          onClick={() => onCopy(messageId)}
        >
          <IoCopyOutline size={20} />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

export default MessageOptionsModal;
