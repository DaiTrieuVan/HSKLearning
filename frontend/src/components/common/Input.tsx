import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  type = 'text',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9)

  return (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={inputId}
        style={{
          fontWeight: 700,
          fontSize: '0.9rem',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {label}
        {props.required && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>*</span>}
      </label>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              color: error ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={inputType}
          style={{
            width: '100%',
            padding: '13px 16px',
            paddingLeft: icon ? '44px' : '16px',
            paddingRight: isPassword ? '44px' : '16px',
            borderRadius: 'var(--radius-md)',
            border: error ? '2px solid var(--primary)' : '2px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--primary)' : 'var(--primary)'
            e.currentTarget.style.boxShadow = error
              ? '0 0 0 3px rgba(225, 29, 72, 0.15)'
              : '0 0 0 3px rgba(225, 29, 72, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--primary)' : '#e2e8f0'
            e.currentTarget.style.boxShadow = 'none'
          }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
            tabIndex={-1}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {helperText && !error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{helperText}</span>
      )}

      {error && (
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            animation: 'float 0.3s ease',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}
