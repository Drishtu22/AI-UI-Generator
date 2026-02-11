import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './VersionHistory.css';

const VersionHistory = ({ versions, currentVersion, onRollback }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRollback = (versionId) => {
    onRollback(versionId);
    setIsOpen(false);
  };

  return (
    <div className="version-history">
      <button className="version-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="version-icon">📋</span>
        <span>Version History</span>
        <span className="version-count">{versions.length}</span>
      </button>

      {isOpen && (
        <div className="version-dropdown">
          <div className="version-header">
            <h4>UI Versions</h4>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="version-list">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`version-item ${currentVersion?.id === version.id ? 'active' : ''}`}
                onClick={() => handleRollback(version.id)}
              >
                <div className="version-info">
                  <span className="version-time">
                    {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                  </span>
                  <span className="version-intent">
                    {version.intent.substring(0, 50)}
                    {version.intent.length > 50 ? '...' : ''}
                  </span>
                </div>
                <div className="version-meta">
                  <span className="component-count">
                    {version.metadata?.componentCount || version.plan?.components?.length || 0} components
                  </span>
                  <span className="layout-badge">{version.plan?.layout || 'single'}</span>
                </div>
                {currentVersion?.id === version.id && (
                  <span className="current-badge">Current</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;