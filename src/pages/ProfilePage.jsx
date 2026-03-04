import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronRight, Shield, HelpCircle, LogOut, Bookmark, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { MdPrivacyTip, MdGavel } from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';
import { IoCopyOutline } from 'react-icons/io5';
import { FaXTwitter, FaFacebook } from 'react-icons/fa6';
import DiceBearAvatar from '../components/DiceBearAvatar';
import ConfirmModal from '../components/common/ConfirmModal';
import { copyWithFeedback } from '../utils/copyToClipboard';
import { auth, signOut } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = ({ theme, onThemeChange, onShowBookmarks }) => {
  const { user } = useAuth();

  // Persist username and avatar in localStorage
  const [username, setUsername] = useState(
    () => localStorage.getItem('profile_username') || 'QuantumExplorer'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    () => localStorage.getItem('profile_avatar') || 'QuantumExplorer'
  );

  const [showEmail, setShowEmail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempAvatar, setTempAvatar] = useState(selectedAvatar);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  const userEmail = user?.email || '';
  const maskedEmail = userEmail
    ? userEmail.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : '';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const themeOptions = [
    { id: 'system', label: 'System', icon: <Monitor size={20} /> },
    { id: 'light', label: 'Light', icon: <Sun size={20} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={20} /> },
  ];

  const menuItems = [
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={20} />, onClick: onShowBookmarks },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={20} />, onClick: () => setShowPrivacy(true) },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} />, onClick: () => setShowSupport(true) },
    { id: 'delete', label: 'Delete All Chats', icon: <Trash2 size={20} />, isDanger: true, onClick: () => setShowDeleteConfirm(true) },
  ];

  const avatarOptions = [
    'QuantumBot1', 'QuantumBot2', 'QuantumBot3', 'QuantumBot4', 'QuantumBot5',
    'QuantumBot6', 'QuantumBot7', 'QuantumBot8', 'QuantumBot9', 'QuantumBot10',
    'QuantumBot11', 'QuantumBot12', 'QuantumBot13', 'QuantumBot14', 'QuantumBot15',
    'QuantumBot16', 'QuantumBot17', 'QuantumBot18', 'QuantumBot19', 'QuantumBot20'
  ];

  // Save to localStorage when modal opens to track temp state
  const handleOpenEditModal = () => {
    setTempUsername(username);
    setTempAvatar(selectedAvatar);
    setShowEditModal(true);
  };

  // Save both to state AND localStorage on confirm
  const handleSaveProfile = () => {
    setUsername(tempUsername);
    setSelectedAvatar(tempAvatar);
    localStorage.setItem('profile_username', tempUsername);
    localStorage.setItem('profile_avatar', tempAvatar);
    setShowEditModal(false);
  };

  const handleDeleteAllChats = () => {
    localStorage.removeItem('chats');
    localStorage.removeItem('currentChatId');
    setShowDeleteConfirm(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutConfirm(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openSocialLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (showPrivacy) {
    return (
      <div className="full-page-view">
        <div className="page-header">
          <button className="back-btn" onClick={() => setShowPrivacy(false)}>
            <ArrowLeft size={20} />
          </button>
          <h2>Privacy & Security</h2>
        </div>
        <div className="page-content">
          <div className="privacy-item clickable" onClick={() => window.open('https://quantumscience-ai.github.io/quantumscience-ai/privacy.html', '_blank')}>
            <MdPrivacyTip size={24} className="privacy-icon" />
            <div className="privacy-info">
              <h3>Privacy Policy</h3>
              <p>View our privacy policy</p>
            </div>
            <ChevronRight size={20} className="privacy-arrow" />
          </div>
          <div className="privacy-item clickable" onClick={() => window.open('https://quantumscience-ai.github.io/quantumscience-ai/terms.html', '_blank')}>
            <MdGavel size={24} className="privacy-icon" />
            <div className="privacy-info">
              <h3>Terms of Use</h3>
              <p>View terms and conditions</p>
            </div>
            <ChevronRight size={20} className="privacy-arrow" />
          </div>
          <div className="privacy-item version-item">
            <BiSupport size={24} className="privacy-icon" />
            <div className="privacy-info">
              <h3>Version</h3>
              <p>2.2026.001 (1)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSupport) {
    return (
      <div className="full-page-view">
        <div className="page-header">
          <button className="back-btn" onClick={() => setShowSupport(false)}>
            <ArrowLeft size={20} />
          </button>
          <h2>Help & Support</h2>
        </div>
        <div className="page-content">
          <p className="support-intro">
            Whether you have a question, a suggestion, or need assistance with our products, feel free to reach out.
          </p>
          <div className="email-card">
            <div className="email-info">
              <HelpCircle size={20} className="email-icon" />
              <span>support@quantumscienceai.com</span>
            </div>
            <button className="email-copy-btn" onClick={() => copyWithFeedback('support@quantumscienceai.com', 'Email copied!')}>
              <IoCopyOutline size={20} />
            </button>
          </div>
          <div className="email-card">
            <div className="email-info">
              <HelpCircle size={20} className="email-icon" />
              <span>contact@quantumscienceai.com</span>
            </div>
            <button className="email-copy-btn" onClick={() => copyWithFeedback('contact@quantumscienceai.com', 'Email copied!')}>
              <IoCopyOutline size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header">
          <div className="avatar-section">
            {isOnline ? (
              <DiceBearAvatar username={selectedAvatar} size={120} />
            ) : (
              <div className="avatar-skeleton"></div>
            )}
            <div className="user-info">
              <h1 className="user-name">{username}</h1>
              <div className="user-email-row">
                <p className="user-email">{showEmail ? userEmail : maskedEmail}</p>
                <button
                  className="email-toggle-btn"
                  onClick={() => setShowEmail(prev => !prev)}
                  title={showEmail ? 'Hide email' : 'Show email'}
                >
                  {showEmail ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button className="edit-profile-btn" onClick={handleOpenEditModal}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Settings</h2>
          <div className="appearance-section">
            <h3 className="setting-title">Appearance</h3>
            <div className="theme-options">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onThemeChange(option.id)}
                  className={`theme-option ${theme === option.id ? 'active' : ''}`}
                >
                  <div className="theme-icon">{option.icon}</div>
                  <span className="theme-label">{option.label}</span>
                  {theme === option.id && (
                    <div className="theme-check">
                      <div className="check-dot" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-list">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item" onClick={item.onClick}>
                <div className="menu-item-left">
                  <div className="menu-icon">{item.icon}</div>
                  <span className={`menu-label ${item.isDanger ? 'danger' : ''}`}>{item.label}</span>
                </div>
                <div className="menu-item-right">
                  <ChevronRight size={20} className="chevron" />
                </div>
              </div>
            ))}

            <div className="menu-item" onClick={() => setShowLogoutConfirm(true)}>
              <div className="menu-item-left">
                <div className="menu-icon"><LogOut size={20} /></div>
                <span className="menu-label danger">Log Out</span>
              </div>
              <div className="menu-item-right">
                <ChevronRight size={20} className="chevron" />
              </div>
            </div>

            <div className="social-section">
              <h3 className="section-subtitle">Get exclusive updates</h3>
              <div className="social-buttons">
                <button className="social-btn" onClick={() => openSocialLink('https://x.com/@QuantumSci_')}>
                  <FaXTwitter size={24} />
                </button>
                <button className="social-btn" onClick={() => openSocialLink('https://www.facebook.com/profile.php?id=61582836719022')}>
                  <FaFacebook size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <p className="footer-text">Made for the Curious</p>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-modal-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="modal-input"
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label>Choose Avatar</label>
                <div className="avatar-grid">
                  {isOnline ? (
                    avatarOptions.map((avatarSeed, index) => (
                      <div
                        key={index}
                        className={`avatar-option ${tempAvatar === avatarSeed ? 'selected' : ''}`}
                        onClick={() => setTempAvatar(avatarSeed)}
                      >
                        <DiceBearAvatar username={avatarSeed} size={60} />
                      </div>
                    ))
                  ) : (
                    avatarOptions.map((_, index) => (
                      <div key={index} className="avatar-skeleton-small"></div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAllChats}
        title="Delete All Chats"
        message="Are you sure you want to delete all your chats? This action cannot be undone."
        confirmText="Delete All"
        type="danger"
      />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        type="danger"
      />
    </div>
  );
};

export default ProfilePage;
