import React from 'react'

interface PandaMascotProps {
  size?: number
  className?: string
}

export const PandaMascot: React.FC<PandaMascotProps> = ({ size = 64, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Ears */}
      <circle cx="24" cy="24" r="14" fill="#1e293b" />
      <circle cx="24" cy="24" r="7" fill="#475569" />
      <circle cx="76" cy="24" r="14" fill="#1e293b" />
      <circle cx="76" cy="24" r="7" fill="#475569" />

      {/* Head */}
      <ellipse cx="50" cy="54" rx="38" ry="34" fill="#ffffff" stroke="#1e293b" strokeWidth="4" />

      {/* Eye Patches */}
      <ellipse cx="34" cy="52" rx="10" ry="13" fill="#1e293b" transform="rotate(-15 34 52)" />
      <ellipse cx="66" cy="52" rx="10" ry="13" fill="#1e293b" transform="rotate(15 66 52)" />

      {/* Eyes & Sparkles */}
      <circle cx="35" cy="51" r="4.5" fill="#ffffff" />
      <circle cx="36" cy="49" r="2" fill="#1e293b" />
      <circle cx="65" cy="51" r="4.5" fill="#ffffff" />
      <circle cx="64" cy="49" r="2" fill="#1e293b" />

      {/* Blush */}
      <ellipse cx="23" cy="62" rx="6" ry="3.5" fill="#fca5a5" opacity="0.6" />
      <ellipse cx="77" cy="62" rx="6" ry="3.5" fill="#fca5a5" opacity="0.6" />

      {/* Nose */}
      <ellipse cx="50" cy="62" rx="6" ry="4" fill="#1e293b" />

      {/* Mouth */}
      <path
        d="M45 68 C48 72, 52 72, 55 68"
        stroke="#1e293b"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Chinese Scholar Little Hat */}
      <path
        d="M38 25 L62 25 L58 16 L42 16 Z"
        fill="#e11d48"
        stroke="#9f1239"
        strokeWidth="2"
      />
      <circle cx="50" cy="13" r="3" fill="#f59e0b" />
    </svg>
  )
}
