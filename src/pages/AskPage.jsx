import { useState, useEffect, useRef } from 'react';
import ChatNavbar from '../components/chat/ChatNavbar';
import ChatTabs from '../components/chat/ChatTabs';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import FileUploadModal from '../components/chat/FileUploadModal';
import MessageOptionsModal from '../components/chat/MessageOptionsModal';
import { MdAdd, MdCode, MdSearch, MdSchool } from 'react-icons/md';
import { PiCaretDoubleDownLight } from 'react-icons/pi';
import { FaStopCircle } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { sendChatMessage, sendMediaMessage } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { canUse, incrementUsage, getRemainingUses } from '../utils/usageTracking';
import NetworkModal from '../components/common/NetworkModal';
import './AskPage.css';

const isMediaRequest = (text) => {
  const t = text.toLowerCase();
  return /\b(image|images|photo|photos|picture|pictures|wallpaper|wallpapers|show me|find me|get me|video|videos|clip|clips|footage|watch|youtube|vimeo)\b/.test(t);
};

const AskPage = ({ onNavigateToHistory }) => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userId] = useState(() => localStorage.getItem('userId') || `user_${Date.now()}`);

  const tabs = [
    { id: 'create', label: 'Create', icon: <MdAdd size={18} /> },
    { id: 'code', label: 'Code', icon: <MdCode size={18} /> },
    { id: 'search', label: 'Search', icon: <MdSearch size={18} /> },
    { id: 'learn', label: 'Learn', icon: <MdSchool size={18} /> }
  ];

  useEffect(() => { localStorage.setItem('userId', userId); }, [userId]);

  useEffect(() => {
    const savedChatId = localStorage.getItem('currentChatId');
    if (savedChatId) {
      const chats = JSON.parse(localStorage.getItem('chats') || '[]');
      const chat = chats.find(c => c.id === savedChatId);
      if (chat) {
        setCurrentChatId(chat.id);
        setMessages(chat.messages || []);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && currentChatId) saveChat();
  }, [messages, currentChatId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const generateChatName = (firstMessage) => {
    const text = firstMessage.substring(0, 50);
    return text.length === 50 ? text + '...' : text;
  };

  const saveChat = () => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    const userMessages = messages.filter(m => m.type === 'user');
    if (userMessages.length === 0) return;
    const chatIndex = chats.findIndex(c => c.id === currentChatId);
    const chatData = {
      id: currentChatId,
      name: generateChatName(userMessages[0].content),
      messages,
      lastMessage: userMessages[userMessages.length - 1]?.content || '',
      date: new Date(),
      messageCount: messages.filter(m => m.type !== 'loading').length
    };
    if (chatIndex >= 0) chats[chatIndex] = chatData;
    else chats.unshift(chatData);
    localStorage.setItem('chats', JSON.stringify(chats));
    localStorage.setItem('currentChatId', currentChatId);
  };

  const handleNetworkError = () => setShowNetworkModal(true);

  const handleUpdateFile = (index, updatedFile) => {
    setUploadedFiles(prev => prev.map((f, i) => i === index ? updatedFile : f));
  };

  const buildApiMessages = () => {
    // Build multipart messages including image data if present
    const imageFiles = uploadedFiles.filter(f => f.isImage && f.dataURL);

    if (imageFiles.length > 0) {
      // Send as vision-style message with image content blocks
      const content = [];

      imageFiles.forEach(f => {
        const dataURL = f.dataURL;
        const base64 = dataURL.split(',')[1];
        const mimeType = dataURL.split(';')[0].split(':')[1] || 'image/jpeg';
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: mimeType, data: base64 }
        });
      });

      if (inputValue.trim()) {
        content.push({ type: 'text', text: inputValue.trim() });
      } else {
        content.push({ type: 'text', text: 'What is in this image? Describe it in detail.' });
      }

      return [{ role: 'user', content }];
    }

    // Text only
    return [{ role: 'user', content: inputValue.trim() }];
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && uploadedFiles.length === 0) || isGenerating) return;
    if (!navigator.onLine) { handleNetworkError(); return; }
    if (!user && !canUse('CHAT')) { setShowLimitModal(true); return; }
    if (!currentChatId) setCurrentChatId(Date.now().toString());

    const hasImages = uploadedFiles.some(f => f.isImage && f.dataURL);

    // For text-only media requests
    if (!hasImages && isMediaRequest(inputValue)) {
      await handleMediaSend();
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      files: uploadedFiles.map(f => ({
        name: f.name,
        isImage: f.isImage,
        dataURL: f.dataURL || f.preview,
      })),
      timestamp: new Date()
    };

    const apiMessages = buildApiMessages();

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setEditingMessage(null);
    setIsGenerating(true);

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, type: 'loading', isThinking: false }]);
    setTimeout(() => scrollToBottom(), 100);

    const thinkingTimeout = setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, isThinking: true } : m));
    }, 3000);

    abortControllerRef.current = new AbortController();

    try {
      // Add previous assistant messages as context
      const fullMessages = [
        ...messages
          .filter(m => m.type !== 'loading' && m.type !== 'user')
          .map(m => ({ role: 'assistant', content: m.content })),
        ...apiMessages
      ];

      let streamedText = '';

      await sendChatMessage(
        fullMessages,
        userId,
        (chunk) => {
          streamedText += chunk;
          const cleanText = streamedText.replace(/\*\*/g, '').replace(/##\s*/g, '').replace(/###\s*/g, '');
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== loadingId);
            const existing = filtered.find(m => m.id === loadingId + 2);
            if (existing) return filtered.map(m => m.id === loadingId + 2 ? { ...m, content: cleanText } : m);
            return [...filtered, { id: loadingId + 2, type: 'ai', content: cleanText, timestamp: new Date() }];
          });
          setTimeout(() => scrollToBottom('auto'), 50);
        },
        (finalText, meta) => {
          clearTimeout(thinkingTimeout);
          const cleanFinal = finalText.replace(/\*\*/g, '').replace(/##\s*/g, '').replace(/###\s*/g, '');
          setMessages(prev => [
            ...prev.filter(m => m.id !== loadingId && m.id !== loadingId + 2),
            { id: loadingId + 2, type: 'ai', content: cleanFinal || streamedText, timestamp: new Date(), metadata: meta }
          ]);
          setIsGenerating(false);
          if (!user) incrementUsage('CHAT');
          setTimeout(() => scrollToBottom(), 100);
        }
      );
    } catch (error) {
      clearTimeout(thinkingTimeout);
      setMessages(prev => [
        ...prev.filter(m => m.id !== loadingId),
        { id: Date.now() + 2, type: 'ai', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }
      ]);
      setIsGenerating(false);
    }
  };

  const handleMediaSend = async () => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsGenerating(true);

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, type: 'loading', isThinking: false }]);
    setTimeout(() => scrollToBottom(), 100);

    const thinkingTimeout = setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, isThinking: true } : m));
    }, 3000);

    try {
      await sendMediaMessage(
        [{ role: 'user', content: inputValue }],
        userId,
        (responseText, meta) => {
          clearTimeout(thinkingTimeout);
          setMessages(prev => [
            ...prev.filter(m => m.id !== loadingId),
            {
              id: loadingId + 2,
              type: 'ai',
              content: responseText || '',
              timestamp: new Date(),
              metadata: { images: meta?.images || [], videos: meta?.videos || [] }
            }
          ]);
          setIsGenerating(false);
          if (!user) incrementUsage('CHAT');
          setTimeout(() => scrollToBottom(), 100);
        }
      );
    } catch (error) {
      clearTimeout(thinkingTimeout);
      setMessages(prev => [
        ...prev.filter(m => m.id !== loadingId),
        { id: Date.now() + 2, type: 'ai', content: 'Sorry, could not fetch media. Please try again.', timestamp: new Date() }
      ]);
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setMessages(prev => prev.filter(m => m.type !== 'loading'));
    }
  };

  const handleTabClick = (tabId) => {
    const prompts = {
      create: "Help me create a quantum circuit",
      code: "Show me quantum code examples",
      search: "Search for quantum algorithms",
      learn: "Teach me about quantum computing"
    };
    setInputValue(prompts[tabId] || '');
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setUploadedFiles([]);
    setCurrentChatId(null);
    setIsGenerating(false);
    localStorage.removeItem('currentChatId');
  };

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMessageLongPress = (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.type === 'user') setShowMessageOptions(messageId);
  };

  const handleEditMessage = (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setInputValue(message.content);
      setEditingMessage(messageId);
      setShowMessageOptions(null);
    }
  };

  const handleCopyMessage = async (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const { copyWithFeedback } = await import('../utils/copyToClipboard');
      copyWithFeedback(message.content, 'Message copied!');
      setShowMessageOptions(null);
    }
  };

  const cancelEdit = () => { setInputValue(''); setEditingMessage(null); };

  const handleRegenerate = (messageId) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      setMessages(messages.slice(0, messageIndex));
      setTimeout(() => handleSend(), 100);
    }
  };

  return (
    <div className="ask-page-container">
      <ChatNavbar onNewChat={handleNewChat} onShowHistory={onNavigateToHistory} />

      {messages.filter(m => m.type !== 'loading').length === 0 ? (
        <div className="empty-chat-state">
          <h2 className="chat-greeting">Hello, how can I help?</h2>
          {!user && (
            <div className="usage-indicator-chat">{getRemainingUses('CHAT')} questions remaining</div>
          )}
          <ChatTabs tabs={tabs} onTabClick={handleTabClick} />
        </div>
      ) : (
        <>
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                onLongPress={handleMessageLongPress}
                onRegenerate={handleRegenerate}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          {showScrollDown && (
            <button className="scroll-down-btn" onClick={() => scrollToBottom()}>
              <PiCaretDoubleDownLight size={24} />
            </button>
          )}
        </>
      )}

      <div className="chat-input-wrapper">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onAttach={() => setShowFileUpload(true)}
          uploadedFiles={uploadedFiles}
          onRemoveFile={removeFile}
          onUpdateFile={handleUpdateFile}
          isEditing={editingMessage !== null}
          onCancelEdit={cancelEdit}
          onNetworkError={handleNetworkError}
          customSendButton={
            isGenerating ? (
              <button className="stop-button" onClick={handleStop} title="Stop generating">
                <FaStopCircle size={20} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                className="send-button"
                disabled={!inputValue.trim() && uploadedFiles.length === 0}
                title="Send message"
              >
                <IoSend size={20} />
              </button>
            )
          }
        />
      </div>

      {showFileUpload && (
        <FileUploadModal onClose={() => setShowFileUpload(false)} onUpload={handleFileUpload} />
      )}
      {showMessageOptions && (
        <MessageOptionsModal
          messageId={showMessageOptions}
          onClose={() => setShowMessageOptions(null)}
          onEdit={handleEditMessage}
          onCopy={handleCopyMessage}
        />
      )}
      <NetworkModal isOpen={showNetworkModal} onClose={() => setShowNetworkModal(false)} />

      {showLimitModal && (
        <div className="modal-overlay" onClick={() => setShowLimitModal(false)}>
          <div className="limit-modal" onClick={e => e.stopPropagation()}>
            <h3>Chat Limit Reached</h3>
            <p>You've used all your free questions.</p>
            <p className="subtitle">Create an account for unlimited access!</p>
            <div className="modal-actions">
              <button className="modal-btn primary" onClick={() => { setShowLimitModal(false); navigate('/signup'); }}>
                Sign Up Free
              </button>
              <button className="modal-btn secondary" onClick={() => setShowLimitModal(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskPage;
