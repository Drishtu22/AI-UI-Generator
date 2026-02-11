import React from 'react';
import './ComponentLibrary.css';

// DETERMINISTIC COMPONENT LIBRARY
// These components NEVER change. Styling is fixed and consistent.

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`ryze-btn ryze-btn-${variant} ryze-btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ 
  children, 
  title, 
  footer,
  className = '',
  ...props 
}) => {
  return (
    <div className={`ryze-card ${className}`} {...props}>
      {title && (
        <div className="ryze-card-header">
          <h3 className="ryze-card-title">{title}</h3>
        </div>
      )}
      <div className="ryze-card-body">{children}</div>
      {footer && (
        <div className="ryze-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="ryze-input-wrapper">
      {label && (
        <label className="ryze-input-label">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`ryze-input ${error ? 'ryze-input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="ryze-input-error-text">{error}</p>
      )}
    </div>
  );
};

export const Table = ({
  columns = [],
  data = [],
  className = '',
  ...props
}) => {
  return (
    <div className={`ryze-table-container ${className}`} {...props}>
      <table className="ryze-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="ryze-modal-overlay">
      <div className={`ryze-modal ${className}`} {...props}>
        <div className="ryze-modal-header">
          {title && (
            <h3 className="ryze-modal-title">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ryze-modal-close"
          >
            ×
          </button>
        </div>
        <div className="ryze-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({
  items = [],
  className = '',
  ...props
}) => {
  return (
    <div className={`ryze-sidebar ${className}`} {...props}>
      <div className="ryze-sidebar-content">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="ryze-sidebar-item"
          >
            {item.icon && <span className="ryze-sidebar-icon">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const Navbar = ({
  brand,
  links = [],
  className = '',
  ...props
}) => {
  return (
    <nav className={`ryze-navbar ${className}`} {...props}>
      <div className="ryze-navbar-brand">
        {brand && (
          <span className="ryze-navbar-brand-text">{brand}</span>
        )}
      </div>
      <div className="ryze-navbar-links">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href || '#'}
            className="ryze-navbar-link"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export const Chart = ({
  type = 'bar',
  data = [],
  title,
  className = '',
  ...props
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  const renderBarChart = () => (
    <div className="ryze-chart-bars">
      {data.map((item, index) => (
        <div key={index} className="ryze-chart-bar-item">
          <div className="ryze-chart-bar-label">
            <span>{item.label}</span>
            <span className="ryze-chart-bar-value">{item.value}</span>
          </div>
          <div className="ryze-chart-bar-track">
            <div
              className="ryze-chart-bar-fill"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="ryze-chart-placeholder">
      <div className="ryze-chart-placeholder-icon">📈</div>
      <div>Line chart: {data.length} data points</div>
    </div>
  );

  const renderPieChart = () => (
    <div className="ryze-chart-placeholder">
      <div className="ryze-chart-placeholder-icon">🥧</div>
      <div>Pie chart: {data.length} segments</div>
    </div>
  );

  return (
    <Card title={title} className={className} {...props}>
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
      {type === 'pie' && renderPieChart()}
    </Card>
  );
};