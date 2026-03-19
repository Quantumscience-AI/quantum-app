import React, { useState } from 'react';
import { X } from 'lucide-react';
import { IoCopyOutline } from 'react-icons/io5';
import { RiSparkling2Fill } from 'react-icons/ri';
import { copyWithFeedback } from '../../utils/copyToClipboard';
import { sendChatMessage } from '../../config/api';
import './ErrorModal.css';

const ErrorModal = ({ error, code, onClose }) => {
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleCopyError = () => {
    copyWithFeedback(`Error: ${error}\n\nCode:\n${code}`, 'Error copied!');
  };

  const handleAskAI = async () => {
    setLoadingAI(true);
    setAiResponse('');
    try {
      const prompt = `I have this JavaScript/quantum code that produced an error. Please fix it and explain what was wrong.\n\nError: ${error}\n\nCode:\n${code}`;
      await sendChatMessage(
        [{ role: 'user', content: prompt }],
        'lab-user',
        (chunk) => {
          setAiResponse(prev => (prev || '') + chunk);
        },
        (finalText) => {
          setAiResponse(finalText);
          setLoadingAI(false);
        }
      );
    } catch (e) {
      setAiResponse('Failed to get AI response. Please try again.');
      setLoadingAI(false);
    }
  };

  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal-card" onClick={e => e.stopPropagation()}>
        <button className="error-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <h3 className="error-title">Execution Error</h3>
        <div className="error-content">
          <p className="error-message">{error}</p>
        </div>
        <div className="error-actions">
          <button className="error-action-btn copy-btn" onClick={handleCopyError}>
            <IoCopyOutline size={18} />
            Copy Error
          </button>
          <button className="error-action-btn ai-btn" onClick={handleAskAI} disabled={loadingAI}>
            <RiSparkling2Fill size={18} />
            {loadingAI ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>
        {aiResponse !== null && (
          <div className="ai-response-container">
            <div className="ai-response-header">
              <span>AI Suggestion</span>
              <button className="copy-response-btn" onClick={() => copyWithFeedback(aiResponse, 'Copied!')}>
                <IoCopyOutline size={16} />
              </button>
            </div>
            <pre className="ai-response-code">
              <code>{aiResponse || '...'}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorModal;
