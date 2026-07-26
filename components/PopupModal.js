'use client';
import React, { useState, useEffect } from 'react';

export default function PopupModal({
  isOpen,
  onClose,
  type = 'alert', // 'alert' | 'confirm' | 'prompt' | 'toast'
  variant = 'info', // 'success' | 'error' | 'warning' | 'info' | 'secure' | 'danger'
  title = '',
  message = '',
  placeholder = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  isPassword = false,
  autoCloseMs = 0
}) {
  const [inputValue, setInputValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setShowPassword(!isPassword);
    }
  }, [isOpen, isPassword]);

  useEffect(() => {
    let timer;
    if (isOpen && autoCloseMs > 0 && type === 'toast') {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
    }
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, type, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && type !== 'confirm') {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inputValue, type]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      if (onConfirm) onConfirm(inputValue);
    } else {
      if (onConfirm) onConfirm();
    }
    onClose();
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'success': return '✨ ✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'secure': return '🔐';
      case 'danger': return '🗑️ ⚠️';
      default: return '💬 ✦';
    }
  };

  const getAccentColor = () => {
    switch (variant) {
      case 'success': return '#10b981';
      case 'error':
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'secure': return '#8b5cf6';
      default: return 'var(--accent-primary)';
    }
  };

  // Toast mode: Floating in bottom/right corner with sleek entrance animation
  if (type === 'toast') {
    return (
      <div 
        className="animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 11000,
          background: 'var(--glass-bg-hover)',
          border: '1px solid',
          borderColor: getAccentColor(),
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.4rem',
          boxShadow: `0 15px 35px -5px rgba(0,0,0,0.8), 0 0 25px ${getAccentColor()}33`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '420px',
          color: 'var(--text-primary)'
        }}
      >
        <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{getVariantIcon()}</span>
        <div style={{ flexGrow: 1 }}>
          {title && <div style={{ fontWeight: 800, fontSize: '0.96rem', fontFamily: 'var(--font-display)', marginBottom: '0.2rem' }}>{title}</div>}
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{message}</div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '0.2rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    );
  }

  // Modal mode: Full centered screen overlay with high precision acrylic finish
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 11000 }}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid',
          borderColor: `${getAccentColor()}88`,
          background: 'var(--bg-secondary)',
          boxShadow: `0 25px 60px -12px rgba(0,0,0,0.9), 0 0 45px ${getAccentColor()}44`
        }}
      >
        {/* Glowing Icon Header */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          margin: '0 auto 1.35rem',
          background: `radial-gradient(circle, ${getAccentColor()}22 0%, rgba(255,255,255,0.03) 100%)`,
          border: '1px solid',
          borderColor: `${getAccentColor()}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: `0 8px 25px -5px ${getAccentColor()}44`
        }}>
          {getVariantIcon()}
        </div>

        {title && (
          <h3 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {title}
          </h3>
        )}

        {message && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: type === 'prompt' ? '1.5rem' : '2.2rem', lineHeight: 1.6 }}>
            {message}
          </p>
        )}

        {/* Input for Prompt Modal */}
        {type === 'prompt' && (
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <input
              type={isPassword && !showPassword ? 'password' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder || 'Enter required input...'}
              autoFocus
              style={{
                width: '100%',
                height: '48px',
                padding: '0 3.2rem 0 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                letterSpacing: isPassword && !showPassword ? '0.15em' : 'normal'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = getAccentColor();
                e.currentTarget.style.boxShadow = `0 0 20px ${getAccentColor()}55`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
              }}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? "Hide secret" : "Show secret"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            )}
          </div>
        )}

        {/* Modal Action Buttons with Symmetrical Typography & Layout */}
        <div className="flex items-center justify-center gap-4" style={{ width: '100%' }}>
          {(type === 'confirm' || type === 'prompt') && (
            <button
              onClick={onClose}
              className="btn-outline"
              style={{
                height: '44px',
                padding: '0 1.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                fontFamily: 'var(--font-display)',
                flexGrow: 1,
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="btn btn-primary"
            style={{
              height: '44px',
              padding: '0 1.8rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.92rem',
              fontFamily: 'var(--font-display)',
              background: variant === 'danger' || variant === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'var(--accent-gradient)',
              boxShadow: `0 4px 15px ${getAccentColor()}55`,
              flexGrow: 1,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
