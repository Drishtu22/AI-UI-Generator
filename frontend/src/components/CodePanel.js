import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './CodePanel.css';

SyntaxHighlighter.registerLanguage('javascript', js);

const CodePanel = ({ code, onCodeChange }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onCodeChange(editedCode);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCode(code);
    setIsEditing(false);
  };

  return (
    <div className="code-panel">
      <div className="code-header">
        <div className="code-title">
          <span className="code-icon">📝</span>
          <span>Generated Code (React)</span>
        </div>
        <div className="code-actions">
          {!isEditing ? (
            <>
              <button className="action-btn" onClick={() => setIsEditing(true)}>
                <span className="action-icon">✏️</span>
                Edit
              </button>
              <button className="action-btn" onClick={handleCopy}>
                <span className="action-icon">{copied ? '✅' : '📋'}</span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </>
          ) : (
            <>
              <button className="action-btn save" onClick={handleSave}>
                <span className="action-icon">💾</span>
                Save
              </button>
              <button className="action-btn cancel" onClick={handleCancel}>
                <span className="action-icon">❌</span>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="code-content">
        {isEditing ? (
          <textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            className="code-editor"
            spellCheck={false}
          />
        ) : (
          <SyntaxHighlighter
            language="javascript"
            style={vs2015}
            showLineNumbers
            wrapLines
            customStyle={{
              margin: 0,
              padding: '16px',
              background: '#1e1e1e',
              fontSize: '13px',
              lineHeight: '1.5',
              height: '100%'
            }}
          >
            {code || '// No code generated yet'}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default CodePanel;