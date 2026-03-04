import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { LuCircuitBoard } from 'react-icons/lu';
import { RiChatAiFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa6';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import NetworkModal from './components/common/NetworkModal';
import AskPage from './pages/AskPage';
import DiscoverPage from './pages/DiscoverPage';
import LabPage from './pages/LabPage';
import ProfilePage from './pages/ProfilePage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './App.css';

const TopNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on auth pages OR when user is logged in
  if (location.pathname === '/login' || 
      location.pathname === '/signup' || 
      location.pathname === '/forgot-password' ||
      user) {
    return null;
  }

  return (
    <div className="top-navbar">
      <div className="navbar-logo">QuantumScienceAI</div>
      
      <div className="navbar-auth-buttons">
        <button className="navbar-btn login-btn" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="navbar-btn signup-btn" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [theme, setTheme] = useState('system');
  const [effectiveTheme, setEffectiveTheme] = useState('dark');
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const { user } = useAuth();
  const { showModal, setShowModal } = useNetworkStatus();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    let actualTheme = theme;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      actualTheme = prefersDark ? 'dark' : 'light';
    }
    
    setEffectiveTheme(actualTheme);
    document.documentElement.setAttribute('data-theme', actualTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleProtectedAction = (action) => {
    if (!user) {
      navigate('/login');
      return false;
    }
    action();
    return true;
  };

  const renderPage = () => {
    if (showHistory) {
      return <ChatHistoryPage onBack={() => setShowHistory(false)} />;
    }
    
    if (showBookmarks) {
      return <BookmarksPage onBack={() => setShowBookmarks(false)} />;
    }

    switch (activeTab) {
      case 'discover':
        return <DiscoverPage />;
      case 'lab':
        return <LabPage />;
      case 'ask':
        return <AskPage onNavigateToHistory={() => handleProtectedAction(() => setShowHistory(true))} />;
      case 'profile':
        if (!user) {
          navigate('/login');
          return null;
        }
        return (
          <ProfilePage
            theme={theme}
            onThemeChange={handleThemeChange}
            onShowBookmarks={() => setShowBookmarks(true)}
          />
        );
      default:
        return <DiscoverPage />;
    }
  };

  const tabs = [
    { id: 'discover', icon: MdOutlineTravelExplore, label: 'Discover' },
    { id: 'lab', icon: LuCircuitBoard, label: 'Code Lab' },
    { id: 'ask', icon: RiChatAiFill, label: 'Ask' },
    { id: 'profile', icon: FaUser, label: 'Profile' },
  ];

  const isDesktop = window.innerWidth >= 768;

  return (
    <>
      <div className="app">
        <TopNavbar />

        {isDesktop && (
          <aside className={`desktop-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'profile' && !user) {
                        navigate('/login');
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon size={24} />
                    <span className="sidebar-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        <main className={`app-main ${isDesktop ? 'with-sidebar' : ''}`}>
          {renderPage()}
        </main>

        {!isDesktop && !showHistory && !showBookmarks && (
          <nav className="bottom-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'profile' && !user) {
                      navigate('/login');
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={24} />
                  <span className="nav-label">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <NetworkModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
