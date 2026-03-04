import { useState, useEffect, useCallback } from 'react';

// Detect if running as native Capacitor app
const isNative = () => {
  return typeof window !== 'undefined' &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform();
};

const useInAppBrowser = () => {
  const [browserState, setBrowserState] = useState({
    isOpen: false,
    url: '',
  });

  const openUrl = useCallback(async (url) => {
    if (isNative()) {
      // Use Capacitor Browser plugin on Android/iOS — no iframe restrictions
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, presentationStyle: 'fullscreen' });
    } else {
      // Web: use our custom iframe modal
      setBrowserState({ isOpen: true, url });
    }
  }, []);

  const closeUrl = useCallback(() => {
    setBrowserState({ isOpen: false, url: '' });
  }, []);

  // Intercept <a> tag clicks globally (web only)
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (!href.startsWith('http://') && !href.startsWith('https://')) return;
      try {
        const linkHost = new URL(href).hostname;
        if (linkHost === window.location.hostname) return;
      } catch { return; }
      if (anchor.dataset.external === 'true') return;

      e.preventDefault();
      e.stopPropagation();
      openUrl(href);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [openUrl]);

  return { browserState, openUrl, closeUrl };
};

export default useInAppBrowser;
