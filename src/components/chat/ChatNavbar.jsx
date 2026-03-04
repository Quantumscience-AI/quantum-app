import React from 'react';
import { BiChat } from 'react-icons/bi';
import { FaHistory } from 'react-icons/fa';
import './ChatNavbar.css';

const ChatNavbar = ({ onNewChat, onShowHistory }) => {
  return (
    <div className="chat-navbar">
      <button className="nav-icon-btn" onClick={onNewChat} title="New Chat">
        <BiChat size={24} />
      </button>
      <h1 className="chat-title">QuantumScience</h1>
      <button className="nav-icon-btn" onClick={onShowHistory} title="Chat History">
        <FaHistory size={20} />
      </button>
    </div>
  );
};

export default ChatNavbar;
