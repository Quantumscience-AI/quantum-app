import { useState, useEffect } from 'react';
import { Search, Share2, Bookmark, X } from 'lucide-react';
import { IoFilterSharp } from 'react-icons/io5';
import { FaWhatsapp, FaTelegram, FaReddit, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import { fetchPapersFeed, searchPapers } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { canUse, incrementUsage, getRemainingUses } from '../utils/usageTracking';
import NetworkModal from '../components/common/NetworkModal';
import './DiscoverPage.css';

const DiscoverPage = ({ onOpenUrl }) => {
  // Use Capacitor Browser for share links on native
  const openExternal = async (url) => {
    const isNative = typeof window !== 'undefined' &&
      window.Capacitor && window.Capacitor.isNativePlatform();
    if (isNative) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedPapers, setBookmarkedPapers] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper — opens in-app browser if available, else falls back to new tab
  const openLink = (url) => {
    if (onOpenUrl) {
      onOpenUrl(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const categories = [
    'All',
    'Tech & AI',
    'Chemistry & Materials',
    'Earth & Environment',
    'Mind & Behavior',
    'Space & Universe',
    'Breakthroughs'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedPapers');
    if (saved) {
      try {
        setBookmarkedPapers(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    if (!navigator.onLine) {
      setShowNetworkModal(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchPapersFeed();
      setPapers(data.papers || []);
    } catch (error) {
      console.error('Failed to load papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (!navigator.onLine) { setShowNetworkModal(true); return; }
    if (!user && !canUse('SEARCH')) { setShowLimitModal(true); return; }

    setLoading(true);
    try {
      const data = await searchPapers(searchQuery);
      setPapers(data.papers || []);
      setSelectedCategory('All');
      if (!user) incrementUsage('SEARCH');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (paper) => {
    const isBookmarked = bookmarkedPapers.some(p => p.id === paper.id);
    const updated = isBookmarked
      ? bookmarkedPapers.filter(p => p.id !== paper.id)
      : [...bookmarkedPapers, paper];
    setBookmarkedPapers(updated);
    localStorage.setItem('bookmarkedPapers', JSON.stringify(updated));
  };

  const handleShare = async (paper) => {
    const shareUrl = `https://quantumscienceai.com/paper/${encodeURIComponent(paper.id)}`;
    const shareText = `${paper.title}\n\n${paper.summary}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: paper.title, text: shareText, url: shareUrl });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }

    setShareData({ url: shareUrl, text: shareText, title: paper.title });
    setShowShareModal(true);
  };

  const handleShareOption = (platform) => {
    const { url, text, title } = shareData;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    };

    if (platform === 'copy') {
      import('../utils/copyToClipboard').then(({ copyWithFeedback }) => {
        copyWithFeedback(url, 'Link copied!');
      });
      setShowShareModal(false);
    } else {
      // Share links always open externally — that's correct behaviour
      openExternal(shareUrls[platform]);
      setShowShareModal(false);
    }
  };

  const handlePaperClick = (paper) => {
    if (paper.pdfLink) {
      openLink(paper.pdfLink);
    } else {
      setShowNotFoundModal(true);
    }
  };

  const filteredPapers = selectedCategory === 'All'
    ? papers
    : papers.filter(p => p.category === selectedCategory);

  const isBookmarked = (paperId) => bookmarkedPapers.some(p => p.id === paperId);

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1 className="discover-title">Discover</h1>

        <div className="search-container">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
          </div>
          <button className="filter-btn" onClick={() => setShowFilters(true)}>
            <IoFilterSharp size={20} />
          </button>
        </div>

        {!user && (
          <div className="usage-indicator">
            {getRemainingUses('SEARCH')} searches remaining
          </div>
        )}
      </div>

      <div className="papers-feed">
        {loading ? (
          <div className="loading-container">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="paper-skeleton">
                <div className="skeleton-category"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-footer"></div>
              </div>
            ))}
          </div>
        ) : filteredPapers.length > 0 ? (
          filteredPapers.map((paper, index) => (
            <div key={`${paper.id}-${index}`}>
              <div className="paper-post" onClick={() => handlePaperClick(paper)}>
                <span className="paper-category">{paper.category}</span>
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-authors">{paper.authors}</p>
                <p className="paper-summary">{paper.summary}</p>
                <div className="paper-meta">
                  <span className="paper-date">{paper.published}</span>
                  <span className="paper-source">{paper.source}</span>
                </div>
                <div className="paper-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="paper-action-btn"
                    onClick={(e) => { e.stopPropagation(); handleShare(paper); }}
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  <button
                    className={`paper-action-btn ${isBookmarked(paper.id) ? 'bookmarked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(paper); }}
                  >
                    <Bookmark size={16} fill={isBookmarked(paper.id) ? 'currentColor' : 'none'} />
                    {isBookmarked(paper.id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
              {index < filteredPapers.length - 1 && <div className="paper-divider" />}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No papers found</p>
            <button className="refresh-btn" onClick={loadFeed}>Refresh</button>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="filter-modal-overlay" onClick={() => setShowFilters(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <h3>Filter by Category</h3>
            <div className="filter-options">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setShowFilters(false); }}
                  className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category}
                  {selectedCategory === category && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={e => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share via</h3>
              <button className="close-modal-btn" onClick={() => setShowShareModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="share-options">
              <button className="share-option-btn whatsapp" onClick={() => handleShareOption('whatsapp')}><FaWhatsapp size={24} /><span>WhatsApp</span></button>
              <button className="share-option-btn telegram" onClick={() => handleShareOption('telegram')}><FaTelegram size={24} /><span>Telegram</span></button>
              <button className="share-option-btn twitter" onClick={() => handleShareOption('twitter')}><FaXTwitter size={24} /><span>X</span></button>
              <button className="share-option-btn reddit" onClick={() => handleShareOption('reddit')}><FaReddit size={24} /><span>Reddit</span></button>
              <button className="share-option-btn facebook" onClick={() => handleShareOption('facebook')}><FaFacebook size={24} /><span>Facebook</span></button>
              <button className="share-option-btn linkedin" onClick={() => handleShareOption('linkedin')}><FaLinkedin size={24} /><span>LinkedIn</span></button>
              <button className="share-option-btn email" onClick={() => handleShareOption('email')}><MdEmail size={24} /><span>Email</span></button>
              <button className="share-option-btn copy" onClick={() => handleShareOption('copy')}><IoCopyOutline size={24} /><span>Copy Link</span></button>
            </div>
          </div>
        </div>
      )}

      {showNotFoundModal && (
        <div className="modal-overlay" onClick={() => setShowNotFoundModal(false)}>
          <div className="not-found-modal" onClick={e => e.stopPropagation()}>
            <h3>Paper Not Found</h3>
            <p>This paper link has expired.</p>
            <p className="subtitle">Please try:</p>
            <ul>
              <li>Searching by title/author</li>
              <li>Browsing recent papers</li>
            </ul>
            <div className="modal-actions">
              <button className="modal-btn primary" onClick={() => { setShowNotFoundModal(false); document.querySelector('.search-input')?.focus(); }}>
                Search Papers
              </button>
              <button className="modal-btn secondary" onClick={() => { setShowNotFoundModal(false); loadFeed(); }}>
                Browse
              </button>
            </div>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="modal-overlay" onClick={() => setShowLimitModal(false)}>
          <div className="limit-modal" onClick={e => e.stopPropagation()}>
            <h3>Search Limit Reached</h3>
            <p>You've used all your free searches.</p>
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

      <NetworkModal isOpen={showNetworkModal} onClose={() => setShowNetworkModal(false)} />
    </div>
  );
};

export default DiscoverPage;
