import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, RotateCw, ExternalLink, X } from 'lucide-react';
import './InAppBrowser.css';

const InAppBrowser = ({ url, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url);
  const iframeRef = useRef(null);

  const handleRefresh = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const displayUrl = () => {
    try {
      const u = new URL(currentUrl);
      return u.hostname + (u.pathname !== '/' ? u.pathname : '');
    } catch {
      return currentUrl;
    }
  };

  return createPortal(
    (
      <div className="iab-overlay">
        <div className="iab-toolbar">
          <button className="iab-btn" onClick={onClose} title="Back to App">
            <ArrowLeft size={20} />
            <span className="iab-back-label">Back</span>
          </button>

          <div className="iab-url-bar">
            <span className="iab-url-text">{displayUrl()}</span>
          </div>

          <div className="iab-actions">
            <button className="iab-btn" onClick={handleRefresh} title="Refresh">
              <RotateCw size={18} />
            </button>
            <button className="iab-btn" onClick={handleOpenExternal} title="Open in browser">
              <ExternalLink size={18} />
            </button>
            <button className="iab-btn" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="iab-loading-bar">
            <div className="iab-loading-progress" />
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={url}
          className="iab-iframe"
          title="In-App Browser"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />
      </div>
    ),
    document.body
  );
};

export default InAppBrowser;
