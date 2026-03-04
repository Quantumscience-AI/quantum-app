import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import HomePage from '../pages/HomePage';
import DiscoverPage from '../pages/DiscoverPage';
import LabPage from '../pages/LabPage';
import AskPage from '../pages/AskPage';
import ProfilePage from '../pages/ProfilePage';
import BookmarksPage from '../pages/BookmarksPage';
import InAppBrowser from './common/InAppBrowser';
import useInAppBrowser from '../hooks/useInAppBrowser';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [theme, setTheme] = useState('dark');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const { browserState, openUrl, closeUrl } = useInAppBrowser();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    document.documentElement.style.setProperty(
      'transition',
      'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    );
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const renderPage = () => {
    if (showBookmarks) return <BookmarksPage onBack={() => setShowBookmarks(false)} />;
    switch (activeTab) {
      case 'home':     return <HomePage />;
      case 'discover': return <DiscoverPage onOpenUrl={openUrl} />;
      case 'lab':      return <LabPage />;
      case 'ask':      return <AskPage />;
      case 'profile':  return <ProfilePage theme={theme} onThemeChange={toggleTheme} onShowBookmarks={() => setShowBookmarks(true)} />;
      default:         return <DiscoverPage onOpenUrl={openUrl} />;
    }
  };

  return (
    <div className={`layout ${theme}`}>
      <main className="main-content">
        {renderPage()}
      </main>
      {!showBookmarks && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {browserState.isOpen && (
        <InAppBrowser url={browserState.url} onClose={closeUrl} />
      )}
    </div>
  );
};

export default Layout;
