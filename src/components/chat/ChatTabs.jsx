import React from 'react';
import './ChatTabs.css';

const ChatTabs = ({ tabs, onTabClick }) => {
  return (
    <div className="quick-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className="quick-tab"
          onClick={() => onTabClick(tab.id)}
        >
          <div className="tab-icon">{tab.icon}</div>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ChatTabs;
