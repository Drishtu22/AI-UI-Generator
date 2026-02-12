import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';
import * as ComponentLibrary from './ComponentLibrary';
import './PreviewPanel.css';

const PreviewPanel = ({ code, isLoading }) => {
  const [renderError, setRenderError] = useState(null);
  const [GeneratedComponent, setGeneratedComponent] = useState(null);

  useEffect(() => {
    // 🔥 Force reset before recompiling (fixes reload glitch)
    setGeneratedComponent(null);
    setRenderError(null);

    if (!code) return;

    try {
      // Transform JSX → JS
      const transformedCode = Babel.transform(code, {
        presets: ['react'],
        filename: 'component.jsx'
      }).code;

      // Clean unwanted syntax
      let processedCode = transformedCode
        .replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '')
        .replace(/export\s+default\s+.*?;?\n?/g, '')
        .replace(/export\s+const\s+(\w+)/g, 'const $1')
        .replace(/export\s+function\s+(\w+)/g, 'function $1')
        .replace(/"use strict";?\n?/g, '')
        .trim();

      // Extract component name safely
      let componentName = 'GeneratedUI';
      const match = processedCode.match(
        /(?:var|const)\s+(\w+)\s*=\s*function|\bfunction\s+(\w+)\s*\(/
      );

      if (match) {
        componentName = match[1] || match[2];
      }

      // Ensure component is returned
      if (!processedCode.includes(`return ${componentName}`)) {
        processedCode += `\nreturn ${componentName};`;
      }

      // Create safe function wrapper
      const ComponentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        ...Object.keys(ComponentLibrary),
        processedCode
      );

      const Component = ComponentFunction(
        React,
        React.useState,
        React.useEffect,
        ...Object.values(ComponentLibrary)
      );

      if (typeof Component === 'function') {
        // 🔥 Force new reference every time
        setGeneratedComponent(() => Component);
      } else {
        throw new Error('Generated code did not produce a valid component');
      }

    } catch (error) {
      console.error('Preview error:', error);
      setRenderError(error.message);
    }

  }, [code]); // 👈 re-run every time code changes

  if (isLoading) {
    return (
      <div className="preview-loading">
        <div className="loading-spinner"></div>
        <p>Generating UI...</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="preview-empty">
        <div className="empty-state">
          <span className="empty-icon">🎨</span>
          <h3>No UI Generated Yet</h3>
          <p>Describe what you want to build in the chat panel</p>
          <div className="empty-suggestions">
            <span>Try: "Create a login form"</span>
            <span>Try: "Show me a dashboard"</span>
          </div>
        </div>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="preview-error">
        <span className="error-icon">⚠️</span>
        <h3>Failed to Render</h3>
        <pre className="error-message">{renderError}</pre>
        <p className="error-hint">
          This component may contain invalid code or use unauthorized components.
        </p>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <span className="preview-indicator">● Live Preview</span>
        <span className="component-count">
          {GeneratedComponent ? 'Component ready' : 'Loading...'}
        </span>
      </div>

      <div className="preview-content">
        {GeneratedComponent && <GeneratedComponent />}
      </div>
    </div>
  );
};

export default PreviewPanel;
