import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiChat } from 'react-icons/bi';
import ConfirmModal from '../components/common/ConfirmModal';
import './ChatHistoryPage.css';

const ChatHistoryPage = ({ onBack }) => {
  const [chats, setChats] = useState([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChats(savedChats);
  };

  const getTimeAgo = (date) => {
    const dateObj = new Date(date);
    const seconds = Math.floor((new Date() - dateObj) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
  };

  const handleDelete = () => {
    const updated = chats.filter(c => c.id !== deletingId);
    setChats(updated);
    localStorage.setItem('chats', JSON.stringify(updated));
    
    // Clear current chat if it's the one being deleted
    const currentChatId = localStorage.getItem('currentChatId');
    if (currentChatId === deletingId) {
      localStorage.removeItem('currentChatId');
    }
    
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleRename = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setEditingId(chatId);
      setEditTitle(chat.name);
      setShowRenameModal(true);
    }
  };

  const saveRename = () => {
    if (editTitle.trim()) {
      const updated = chats.map(c => 
        c.id === editingId ? { ...c, name: editTitle } : c
      );
      setChats(updated);
      localStorage.setItem('chats', JSON.stringify(updated));
    }
    setShowRenameModal(false);
    setEditingId(null);
    setEditTitle('');
  };

  const handleChatClick = (chatId) => {
    localStorage.setItem('currentChatId', chatId);
    onBack();
  };

  return (
    <div className="chat-history-page">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Recent Chats</h2>
      </div>

      <div className="history-content">
        {chats.length === 0 ? (
          <div className="empty-history">
            <BiChat size={64} className="empty-icon" />
            <p>No conversations yet</p>
            <span>Start chatting to see your history here</span>
          </div>
        ) : (
          <div className="chats-feed">
            {chats.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <div className="chat-post" onClick={() => handleChatClick(chat.id)}>
                  <div className="chat-post-content">
                    <h3 className="chat-post-title">{chat.name}</h3>
                    <p className="chat-post-preview">{chat.lastMessage}</p>
                    <span className="chat-post-time">{getTimeAgo(chat.date)}</span>
                  </div>
                  
                  <div className="chat-post-actions">
                    <button 
                      className="chat-post-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(chat.id);
                      }}
                      title="Rename"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                    <button 
                      className="chat-post-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(chat.id);
                        setShowDeleteModal(true);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {index < chats.length - 1 && <div className="chat-divider" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {showRenameModal && (
        <div className="modal-overlay" onClick={() => setShowRenameModal(false)}>
          <div className="rename-modal" onClick={e => e.stopPropagation()}>
            <h3>Rename Chat</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveRename()}
              placeholder="Enter chat name"
              className="rename-input"
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowRenameModal(false)}>
                Cancel
              </button>
              <button className="modal-save-btn" onClick={saveRename}>
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ChatHistoryPage;
