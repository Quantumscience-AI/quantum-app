import { useEffect, useState } from 'react';

const CURRENT_VERSION_CODE = 28;

const useAppUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const isNative = window.Capacitor && window.Capacitor.isNativePlatform();
        if (!isNative) return; // Only check on native app

        const res = await fetch('https://quantumscienceai.com/version.json?t=' + Date.now(), {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();

        if (data.versionCode > CURRENT_VERSION_CODE) {
          setUpdateAvailable(true);
          setUpdateMessage(data.updateMessage || 'A new version is available.');
          setPlayStoreUrl(data.playStoreUrl);
          setForceUpdate(data.forceUpdate || false);
        }
      } catch (e) {
        console.log('Update check failed:', e);
      }
    };

    checkUpdate();
  }, []);

  return { updateAvailable, updateMessage, playStoreUrl, forceUpdate };
};

export default useAppUpdate;
