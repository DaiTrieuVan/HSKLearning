import React from 'react'

interface PasswordStrengthMeterProps {
  password: string
  maxLength?: number
}

export const getPasswordStrength = (pass: string) => {
  if (!pass) return { score: 0, label: '', color: '#e2e8f0' }
  if (pass.length < 8) return { score: 1, label: 'Quá ngắn (tối thiểu 8 ký tự)', color: '#ef4444' }
  let score = 1
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++

  if (score <= 2) return { score: 2, label: 'Trung bình', color: '#f59e0b' }
  return { score: 3, label: 'Mạnh mẽ', color: '#10b981' }
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  maxLength = 72,
}) => {
  if (!password) return null

  const strength = getPasswordStrength(password)

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            flex: 1,
            backgroundColor: strength.score >= 1 ? strength.color : '#e2e8f0',
            transition: 'background-color 0.2s',
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundColor: strength.score >= 2 ? strength.color : '#e2e8f0',
            transition: 'background-color 0.2s',
          }}
        />
        <div
          style={{
            flex: 1,
            backgroundColor: strength.score >= 3 ? strength.color : '#e2e8f0',
            transition: 'background-color 0.2s',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem' }}>
        <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
        <span style={{ color: 'var(--text-muted)' }}>
          {password.length}/{maxLength} ký tự
        </span>
      </div>
    </div>
  )
}
