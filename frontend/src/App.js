// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import CodePanel from './components/CodePanel';
import PreviewPanel from './components/PreviewPanel';
import VersionHistory from './components/VersionHistory';
import ExplanationPanel from './components/ExplanationPanel';
import { AgentService } from './services/AgentService';
import { VersionStore } from './store/VersionStore';
import './App.css';

function App() {
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const versions = await VersionStore.getVersions();
      setVersions(versions);
      if (versions.length > 0) {
        setCurrentVersion(versions[0]);
      }
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const handleGenerateUI = async (intent) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AgentService.generateUI(intent, currentVersion?.id);
      const newVersion = response.version;

      setVersions(prev => [newVersion, ...prev]);
      setCurrentVersion(newVersion);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate UI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyUI = async (intent) => {
    if (!currentVersion?.id) {
      setError('No UI to modify. Generate one first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AgentService.modifyUI(intent, currentVersion.id);
      const newVersion = response.version;

      setVersions(prev => [newVersion, ...prev]);
      setCurrentVersion(newVersion);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to modify UI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = (versionId) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setCurrentVersion(version);
    }
  };

  const handleCodeEdit = (newCode) => {
    if (currentVersion) {
      setCurrentVersion({
        ...currentVersion,
        code: newCode
      });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <h1>Ryze AI UI Generator</h1>
          </div>
          <span className="badge deterministic">Deterministic Mode</span>
          <span className="badge agent">Multi-Step Agent</span>
        </div>

        <VersionHistory
          versions={versions}
          currentVersion={currentVersion}
          onRollback={handleRollback}
        />
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="main-layout">

        <div className="left-panel">
          <ChatPanel
            onGenerate={handleGenerateUI}
            onModify={handleModifyUI}
            isLoading={isLoading}
            currentUI={currentVersion}
          />

          {currentVersion?.explanation && (
            <ExplanationPanel explanation={currentVersion.explanation} />
          )}
        </div>

        <div className="right-panel">
          <div className="tab-header">
            <button
              className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Live Preview
            </button>

            <button
              className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Generated Code
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'preview' ? (
              <PreviewPanel
                code={currentVersion?.code || ''}
                isLoading={isLoading}
              />
            ) : (
              <CodePanel
                code={currentVersion?.code || ''}
                onCodeChange={handleCodeEdit}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
