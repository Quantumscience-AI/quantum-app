import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Trash2, ExternalLink } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';
import './BookmarksPage.css';

const BookmarksPage = ({ onBack }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedPapers');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    }
  }, []);

  const handleDeleteClick = (paperId, e) => {
    e.stopPropagation();
    setDeleteId(paperId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    const updated = bookmarks.filter(b => b.id !== deleteId);
    setBookmarks(updated);
    localStorage.setItem('bookmarkedPapers', JSON.stringify(updated));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handlePaperClick = (paper) => {
    if (paper.pdfLink) {
      window.open(paper.pdfLink, '_blank', 'noopener,noreferrer');
    } else if (paper.link) {
      window.open(paper.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Bookmarks</h2>
      </div>

      <div className="bookmarks-content">
        {bookmarks.length === 0 ? (
          <div className="empty-bookmarks">
            <Bookmark size={64} className="empty-icon" />
            <p>No bookmarks yet</p>
            <span>Save papers to read them later</span>
          </div>
        ) : (
          <div className="bookmarks-list">
            {bookmarks.map((paper, index) => (
              <div key={paper.id}>
                <div className="bookmark-item" onClick={() => handlePaperClick(paper)}>
                  <div className="bookmark-content">
                    <span className="bookmark-category">{paper.category}</span>
                    <h3 className="bookmark-title">{paper.title}</h3>
                    <p className="bookmark-authors">{paper.authors}</p>
                    <p className="bookmark-summary">{paper.summary}</p>
                    <span className="bookmark-date">{paper.published}</span>
                  </div>
                  <div className="bookmark-actions">
                    <button 
                      className="bookmark-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaperClick(paper);
                      }}
                      title="Open"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      className="bookmark-action-btn delete"
                      onClick={(e) => handleDeleteClick(paper.id, e)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {index < bookmarks.length - 1 && <div className="bookmark-divider" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remove Bookmark"
        message="Are you sure you want to remove this paper from your bookmarks?"
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default BookmarksPage;
