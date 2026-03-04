import { useState } from 'react';
import { IoCopyOutline, IoImageOutline } from 'react-icons/io5';
import { FaRepeat } from 'react-icons/fa6';
import { copyWithFeedback } from '../../utils/copyToClipboard';
import CodeBlock from './CodeBlock';
import './MessageBubble.css';

const ImageSkeleton = () => (
  <div className="media-image-skeleton" />
);

const MediaImage = ({ img }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <a
      href={img.creditUrl || img.url}
      target="_blank"
      rel="noopener noreferrer"
      className="media-image-card"
    >
      {!loaded && <ImageSkeleton />}
      <img
        src={img.url}
        alt={img.alt || 'image'}
        className="media-image"
        style={{ display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {loaded && img.credit && (
        <span className="media-image-credit">
          {img.source === 'unsplash' ? '📷' : '🎞'} {img.credit}
        </span>
      )}
    </a>
  );
};

const MediaVideo = ({ video }) => {
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="media-video-card"
    >
      {!thumbLoaded && !thumbError && <ImageSkeleton />}
      {video.thumbnail && !thumbError && (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="media-video-thumb"
          style={{ display: thumbLoaded ? 'block' : 'none' }}
          onLoad={() => setThumbLoaded(true)}
          onError={() => setThumbError(true)}
        />
      )}
      {thumbError && (
        <div className="media-video-thumb-fallback">&#9658;</div>
      )}
      <div className="media-video-info">
        <span className="media-video-source">
          {video.source === 'youtube' ? 'YouTube' : 'Vimeo'}
        </span>
        <span className="media-video-title">{video.title}</span>
        {video.channel && (
          <span className="media-video-channel">{video.channel}</span>
        )}
      </div>
    </a>
  );
};

const MessageBubble = ({ message, onLongPress, onRegenerate }) => {
  const [pressTimer, setPressTimer] = useState(null);

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      if (onLongPress) onLongPress(message.id);
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleCopy = () => {
    copyWithFeedback(message.content, 'Message copied!');
  };

  const parseContent = (content) => {
    if (!content) return [{ type: 'text', content: '' }];
    const parts = [];
    // Match ``` with optional language and optional space/newline after
    const codeBlockRegex = /```([\w+\-]*)?[ \t]*\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const text = content.substring(lastIndex, match.index);
        if (text.trim()) parts.push({ type: 'text', content: text });
      }
      const lang = (match[1] || 'javascript').trim() || 'javascript';
      parts.push({ type: 'code', language: lang, content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      const remaining = content.substring(lastIndex);
      if (remaining.trim()) parts.push({ type: 'text', content: remaining });
    }
    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  if (message.type === 'loading') {
    return (
      <div className="chat-message ai loading-message">
        <div className="loading-bubble">
          {message.isThinking ? (
            <div className="thinking-text">
              <span className="thinking-shimmer">Thinking...</span>
            </div>
          ) : (
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (message.type === 'user') {
    return (
      <div
        className="chat-message user"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div className="message-bubble user-bubble">
          {message.files && message.files.length > 0 && (
            <div className="message-files">
              {message.files.map((file, index) => (
                <div key={index} className="message-file-icon">
                  <IoImageOutline size={24} color="var(--color-text-secondary)" />
                </div>
              ))}
            </div>
          )}
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  const images = message.metadata?.images || [];
  const videos = message.metadata?.videos || [];

  return (
    <div className="chat-message ai">
      <div className="ai-message-container">
        <div className="ai-message-content">
          {parseContent(message.content || '').map((part, index) => {
            if (part.type === 'code') {
              return <CodeBlock key={index} code={part.content} language={part.language} />;
            }
            return (
              <p key={index} className="message-text">
                {part.content}
              </p>
            );
          })}
          {images.length > 0 && (
            <div className="media-images-grid">
              {images.map((img, i) => (
                <MediaImage key={i} img={img} />
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <div className="media-videos-list">
              {videos.map((video, i) => (
                <MediaVideo key={i} video={video} />
              ))}
            </div>
          )}
        </div>
        <div className="message-actions">
          <button className="message-action-btn" onClick={handleCopy} title="Copy">
            <IoCopyOutline size={16} />
          </button>
          {onRegenerate && (
            <button
              className="message-action-btn"
              onClick={() => onRegenerate(message.id)}
              title="Regenerate"
            >
              <FaRepeat size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
