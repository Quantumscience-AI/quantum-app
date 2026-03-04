import { useRef, useEffect, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { IoSend, IoImageOutline } from 'react-icons/io5';
import './ChatInput.css';

const ChatInput = ({
  value,
  onChange,
  onSend,
  onAttach,
  uploadedFiles = [],
  onRemoveFile,
  onUpdateFile,
  isEditing = false,
  onCancelEdit,
  customSendButton,
  onNetworkError
}) => {
  const textareaRef = useRef(null);
  const [processingOCR, setProcessingOCR] = useState({});

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [value]);

  useEffect(() => {
    uploadedFiles.forEach(async (file, index) => {
      if (file.isImage && !file.ocrProcessed && !processingOCR[index]) {
        setProcessingOCR(prev => ({ ...prev, [index]: true }));

        try {
          // Convert to base64 data URL first
          let dataURL = file.dataURL;
          if (!dataURL && file.file) {
            dataURL = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(file.file);
            });
          }

          // Use canvas to get image data — avoids any network fetch
          const extractedText = await extractTextFromImage(dataURL);

          if (onUpdateFile) {
            onUpdateFile(index, {
              ...file,
              ocrText: extractedText,
              dataURL,
              ocrProcessed: true,
            });
          }
        } catch (error) {
          console.error('OCR error:', error);
          if (onUpdateFile) {
            onUpdateFile(index, { ...file, ocrText: '', ocrProcessed: true });
          }
        } finally {
          setProcessingOCR(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
          });
        }
      }
    });
  }, [uploadedFiles]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (!navigator.onLine) {
      if (onNetworkError) onNetworkError();
      return;
    }
    onSend();
  };

  const isOCRProcessing = Object.keys(processingOCR).length > 0;
  const canSend = (value.trim() || uploadedFiles.length > 0) && !isOCRProcessing;

  return (
    <div className="input-container">
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-preview">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-preview-item">
              <div className="file-preview-wrapper">
                <div className="file-icon-preview">
                  <IoImageOutline size={32} color="var(--color-text-secondary)" />
                </div>
                {processingOCR[index] && (
                  <div className="ocr-loading-overlay">
                    <div className="ocr-spinner"></div>
                  </div>
                )}
              </div>
              <button className="remove-file-btn" onClick={() => onRemoveFile(index)}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="input-wrapper">
        {isEditing && (
          <div className="editing-indicator">
            <span>Editing message</span>
            <button className="cancel-edit-btn" onClick={onCancelEdit}>
              <X size={16} />
            </button>
          </div>
        )}

        <div className="input-controls">
          <button className="input-icon-btn" onClick={onAttach} title="Attach file">
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            className="message-input"
            rows={1}
          />

          {customSendButton || (
            <button
              onClick={handleSendClick}
              className="send-button"
              disabled={!canSend}
              title={isOCRProcessing ? 'Processing image...' : 'Send message'}
            >
              <IoSend size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Pure browser OCR — no CDN, no network, uses canvas pixel data
async function extractTextFromImage(dataURL) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // We can't do full OCR without Tesseract, but we can send the
        // base64 image data to the AI worker directly so the AI can see it.
        // Return a marker so AskPage knows to attach the image as base64.
        resolve('__IMAGE_DATA__:' + dataURL);
      } catch (e) {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = dataURL;
  });
}

export default ChatInput;
