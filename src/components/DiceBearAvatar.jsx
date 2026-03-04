import React, { useState } from 'react';

const DiceBearAvatar = ({ username, size = 80 }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}&size=${size}`;

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {(!loaded || error) && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(90deg, var(--color-surface-alt) 25%, var(--color-surface) 50%, var(--color-surface-alt) 75%)',
          backgroundSize: '200% 100%',
          animation: 'avatarSkeleton 1.4s infinite',
        }} />
      )}
      {!error && (
        <img
          src={avatarUrl}
          alt={username}
          style={{ width: '100%', height: '100%', objectFit: 'cover',
            opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
        />
      )}
    </div>
  );
};

export default DiceBearAvatar;
