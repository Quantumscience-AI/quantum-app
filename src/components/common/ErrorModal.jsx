import React, { useState } from 'react';
import { X } from 'lucide-react';
import { IoCopyOutline } from 'react-icons/io5';
import { RiSparkling2Fill } from 'react-icons/ri';
import { copyWithFeedback } from '../../utils/copyToClipboard';
import './ErrorModal.css';

const ErrorModal = ({ error, code, onClose, onAskAI }) => {
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleCopyError = () => {
    const errorText = `Error: ${error}\n\nCode:\n${code}`;
    copyWithFeedback(errorText, 'Error copied!');
  };

  const handleAskAI = async () => {
    setLoadingAI(true);
    
    setTimeout(() => {
      const fixedCode = `// Fixed code suggestion:
let state = jsqubits('|00>');

// Apply gates
state = state.hadamard(0);
state = state.cnot(0, 1);

// The qubits are now entangled!`;
      
      setAiResponse(fixedCode);
      setLoadingAI(false);
    }, 1500);
  };

  const handleCopyAIResponse = () => {
    if (aiResponse) {
      copyWithFeedback(aiResponse, 'Code copied!');
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
            {loadingAI ? 'Asking AI...' : 'Ask AI'}
          </button>
        </div>
        
        {aiResponse && (
          <div className="ai-response-container">
            <div className="ai-response-header">
              <span>AI Suggestion</span>
              <button className="copy-response-btn" onClick={handleCopyAIResponse}>
                <IoCopyOutline size={16} />
              </button>
            </div>
            <pre className="ai-response-code">
              <code>{aiResponse}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorModal;
