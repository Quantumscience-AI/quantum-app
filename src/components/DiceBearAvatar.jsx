import React from 'react';

const DiceBearAvatar = ({ username, size = 80 }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}&size=${size}`;
  
  return (
    <div 
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img 
        src={avatarUrl}
        alt={username}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: 'transparent'
        }}
      />
    </div>
  );
};

export default DiceBearAvatar;
