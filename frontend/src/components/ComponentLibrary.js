import React from 'react';
import './ComponentLibrary.css';

// 🔒 Helper: Always return array
const ensureArray = (value) => (Array.isArray(value) ? value : []);

// ================= BUTTON =================
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

// ================= CARD =================
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

// ================= INPUT =================
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
      {label && <label className="ryze-input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        className={`ryze-input ${error ? 'ryze-input-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="ryze-input-error-text">{error}</p>}
    </div>
  );
};

// ================= TABLE =================
export const Table = ({
  columns = [],
  data = [],
  className = '',
  ...props
}) => {
  const safeColumns = ensureArray(columns);
  const safeData = ensureArray(data);

  return (
    <div className={`ryze-table-container ${className}`} {...props}>
      <table className="ryze-table">
        <thead>
          <tr>
            {safeColumns.map((column, index) => (
              <th key={index}>
                {column?.label || ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={safeColumns.length || 1}>
                No data available
              </td>
            </tr>
          ) : (
            safeData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {safeColumns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {row?.[column?.key] ?? ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ================= MODAL =================
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
          {title && <h3 className="ryze-modal-title">{title}</h3>}
          <button onClick={onClose} className="ryze-modal-close">
            ×
          </button>
        </div>
        <div className="ryze-modal-body">{children}</div>
      </div>
    </div>
  );
};

// ================= SIDEBAR =================
export const Sidebar = ({
  items = [],
  className = '',
  ...props
}) => {
  const safeItems = ensureArray(items);

  return (
    <div className={`ryze-sidebar ${className}`} {...props}>
      <div className="ryze-sidebar-content">
        {safeItems.map((item, index) => (
          <button
            key={index}
            onClick={item?.onClick}
            className="ryze-sidebar-item"
          >
            {item?.icon && (
              <span className="ryze-sidebar-icon">{item.icon}</span>
            )}
            <span>{item?.label || ''}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ================= NAVBAR =================
export const Navbar = ({
  brand,
  links = [],
  className = '',
  ...props
}) => {
  const safeLinks = ensureArray(links);

  return (
    <nav className={`ryze-navbar ${className}`} {...props}>
      <div className="ryze-navbar-brand">
        {brand && (
          <span className="ryze-navbar-brand-text">{brand}</span>
        )}
      </div>
      <div className="ryze-navbar-links">
        {safeLinks.map((link, index) => (
          <a
            key={index}
            href={link?.href || '#'}
            className="ryze-navbar-link"
          >
            {link?.label || ''}
          </a>
        ))}
      </div>
    </nav>
  );
};

// ================= CHART =================
export const Chart = ({
  type = 'bar',
  data = [],
  title,
  className = '',
  ...props
}) => {
  const safeData = ensureArray(data);

  // Extract numeric values safely
  const numericValues = safeData.map(d =>
    typeof d?.value === 'number' ? d.value : 0
  );

  const maxValue =
    numericValues.length > 0
      ? Math.max(...numericValues, 0)
      : 0;

  const renderBarChart = () => {
    if (safeData.length === 0) {
      return <div>No chart data available</div>;
    }

    return (
      <div className="ryze-chart-bars">
        {safeData.map((item, index) => {
          const value =
            typeof item?.value === 'number' ? item.value : 0;

          const width =
            maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={index} className="ryze-chart-bar-item">
              <div className="ryze-chart-bar-label">
                <span>{item?.label || ''}</span>
                <span className="ryze-chart-bar-value">
                  {value}
                </span>
              </div>
              <div className="ryze-chart-bar-track">
                <div
                  className="ryze-chart-bar-fill"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="ryze-chart-placeholder">
      <div className="ryze-chart-placeholder-icon">📈</div>
      <div>Line chart: {safeData.length} data points</div>
    </div>
  );

  const renderPieChart = () => (
    <div className="ryze-chart-placeholder">
      <div className="ryze-chart-placeholder-icon">🥧</div>
      <div>Pie chart: {safeData.length} segments</div>
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
