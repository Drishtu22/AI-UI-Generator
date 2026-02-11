// frontend/src/components/ChatPanel.js
import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

const ChatPanel = ({ onGenerate, onModify, isLoading, currentUI }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'assistant',
          content: '👋 Describe the UI you want to build. I\'ll generate deterministic React code using our fixed component library.',
          timestamp: Date.now()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const intent = input;
    setInput('');
    resetTextareaHeight();
    
    try {
      let response;
      
      // Check if we have a current UI to modify
      if (currentUI && currentUI.id) {
        console.log('Modifying existing UI:', currentUI.id);
        response = await onModify(intent);
      } else {
        console.log('Generating new UI');
        response = await onGenerate(intent);
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `✅ ${currentUI ? 'Modified' : 'Generated'} UI based on: "${intent}"`,
        timestamp: Date.now()
      }]);
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `❌ Error: ${error.response?.data?.error || error.message || 'Failed to generate UI'}`,
        timestamp: Date.now()
      }]);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = () => {
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: '👋 Describe the UI you want to build. I\'ll generate deterministic React code using our fixed component library.',
      timestamp: Date.now()
    }]);
    setInput('');
    // Reset current UI by reloading the page or clearing state
    window.location.reload();
  };

  const examples = [
    "Show me a login form with email and password",
    "Create a dashboard with a chart and data table",
    "Build a settings page with a modal for confirmation",
    "Make a product card with image and buy button"
  ];

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          <h3>AI Chat</h3>
        </div>
        <div className="chat-controls">
          <span className="model-badge">Agent Mode</span>
          <button className="new-chat-btn" onClick={handleNewChat} title="New conversation">
            <span>➕</span>
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">
                  {message.type === 'user' ? 'You' : message.type === 'error' ? 'System' : 'Ryze AI'}
                </span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="message-text">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant loading">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">Ryze AI</span>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="examples-section">
        <div className="examples-title">Try an example:</div>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <button
              key={index}
              className="example-btn"
              onClick={() => setInput(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={currentUI ? "Modify the current UI..." : "Describe your UI..."}
            disabled={isLoading}
            rows={1}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
        <div className="input-hint">
          {currentUI ? 'Modifying existing UI' : 'Generating new UI'} • Press Enter to send
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;