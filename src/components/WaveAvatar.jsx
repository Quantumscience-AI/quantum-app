import React from 'react';
import './WaveAvatar.css';

const WaveAvatar = ({ size = 100, color = 'blue', active = false }) => {
  const getWaveColors = (color) => {
    const colors = {
      blue: ['#60a5fa', '#3b82f6', '#1d4ed8'],
      purple: ['#a78bfa', '#8b5cf6', '#7c3aed'],
      emerald: ['#34d399', '#10b981', '#059669'],
      rose: ['#fda4af', '#fb7185', '#e11d48'],
    };
    return colors[color] || colors.blue;
  };
  
  const [color1, color2, color3] = getWaveColors(color);
  
  const style = {
    '--avatar-size': `${size}px`,
    '--wave-color-1': color1,
    '--wave-color-2': color2,
    '--wave-color-3': color3,
  };
  
  return (
    <div 
      className="wave-avatar-container"
      style={style}
    >
      {/* Outer glow when active */}
      {active && (
        <div className="wave-avatar-glow" />
      )}
      
      {/* Circular container */}
      <div className="wave-avatar-circle">
        {/* Wave layers */}
        <div className="wave-avatar-waves">
          <div className="wave-layer wave-layer-1" />
          <div className="wave-layer wave-layer-2" />
          <div className="wave-layer wave-layer-3" />
        </div>
        
        {/* Water surface effect */}
        <div className="wave-avatar-surface" />
        
        {/* Floating particles */}
        <div className="wave-avatar-particles">
          {Array.from({ length: 12 }).map((_, i) => {
            const particleStyle = {
              '--particle-delay': `${Math.random() * 2}s`,
              '--particle-duration': `${Math.random() * 3 + 2}s`,
              '--particle-top': `${Math.random() * 100}%`,
              '--particle-left': `${Math.random() * 100}%`,
              '--particle-size': `${Math.random() * 4 + 2}px`,
              '--particle-opacity': Math.random() * 0.5 + 0.3,
              '--particle-color': i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3,
            };
            
            return (
              <div
                key={i}
                className="wave-particle"
                style={particleStyle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WaveAvatar;

// Color selector component
export const ColorSelector = ({ selected, onSelect }) => {
  const colors = [
    { name: 'blue', label: 'Blue' },
    { name: 'purple', label: 'Purple' },
    { name: 'emerald', label: 'Emerald' },
    { name: 'rose', label: 'Rose' },
  ];
  
  return (
    <div className="color-selector">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onSelect(color.name)}
          className={`color-button ${color.name} ${selected === color.name ? 'selected' : ''}`}
          title={color.label}
        />
      ))}
    </div>
  );
};
