import React, { useState } from 'react';
import './ExplanationPanel.css';

const ExplanationPanel = ({ explanation }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!explanation) return null;

  return (
    <div className="explanation-panel">
      <div className="explanation-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="explanation-title">
          <span className="explanation-icon">🧠</span>
          <h4>AI Decision Explanation</h4>
        </div>
        <button className="collapse-btn">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="explanation-content">
          {explanation.split('\n').map((line, i) => {
            if (line.startsWith('•')) {
              return (
                <li key={i} className="bullet-item">
                  {line.substring(1)}
                </li>
              );
            }
            if (line.includes(':')) {
              const [title, ...rest] = line.split(':');
              return (
                <p key={i} className="explanation-section">
                  <strong>{title}:</strong>{rest.join(':')}
                </p>
              );
            }
            return line.trim() ? <p key={i}>{line}</p> : <br key={i} />;
          })}
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;