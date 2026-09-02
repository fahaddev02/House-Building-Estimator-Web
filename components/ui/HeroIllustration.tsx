import React from "react";

export default function HeroIllustration({ className = "w-full max-w-lg" }: { className?: string }) {
  return (
    <div className={`relative ${className} select-none`}>
      <svg
        viewBox="0 0 540 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="paintStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="tapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Backdrop decorative circles */}
        <circle cx="270" cy="230" r="190" fill="#EEF2FF" className="dark:opacity-10" />
        <circle cx="430" cy="110" r="45" fill="#DBEAFE" className="dark:opacity-10" />
        <circle cx="80" cy="360" r="55" fill="#FEF3C7" className="dark:opacity-10" />

        {/* 1. HOUSE SILHOUETTE (Center/Backdrop) */}
        <g id="house-structure">
          {/* Main Wall */}
          <rect x="120" y="160" width="240" height="210" rx="16" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" className="dark:fill-slate-800 dark:stroke-slate-700" />
          {/* Roof */}
          <path d="M100 170L240 60L380 170" fill="none" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="125,160 240,70 355,160" fill="#E2E8F0" className="dark:fill-slate-700" />
          {/* Window on House */}
          <rect x="150" y="200" width="60" height="60" rx="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="180" y1="200" x2="180" y2="260" stroke="#0284C7" strokeWidth="2" />
          <line x1="150" y1="230" x2="210" y2="230" stroke="#0284C7" strokeWidth="2" />
          {/* House Door */}
          <rect x="250" y="250" width="60" height="120" rx="6" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" className="dark:fill-slate-600" />
          <circle cx="298" cy="310" r="4" fill="#F59E0B" />
        </g>

        {/* 2. FRESH PAINT STROKE ON HOUSE */}
        <g id="paint-stroke">
          <path
            d="M130 190 C 200 175, 270 205, 340 185"
            stroke="url(#paintStrokeGrad)"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Dripping paint droplets */}
          <circle cx="210" cy="215" r="4" fill="#2563EB" />
          <path d="M210 215 C208 225, 212 225, 210 232 C207 225, 213 225, 210 215 Z" fill="#2563EB" />
          <circle cx="290" cy="210" r="3.5" fill="#2563EB" />
        </g>

        {/* 3. PAINT ROLLER (Hovering above the stroke) */}
        <g id="paint-roller" transform="translate(230, 80) rotate(-15)">
          {/* Roller Cylinder */}
          <rect x="0" y="0" width="110" height="34" rx="8" fill="url(#wallGrad)" filter="url(#softGlow)" />
          {/* Texture lines on roller */}
          <line x1="20" y1="5" x2="20" y2="29" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="5" x2="50" y2="29" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="80" y1="5" x2="80" y2="29" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          {/* Metal Frame */}
          <path
            d="M 110 17 L 125 17 L 125 70 L 65 70 L 65 95"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Handle */}
          <rect x="57" y="95" width="16" height="50" rx="4" fill="#0F172A" />
          <rect x="59" y="130" width="12" height="10" rx="2" fill="#F59E0B" />
        </g>

        {/* 4. PAINT BUCKET (Front Right) */}
        <g id="paint-bucket" transform="translate(330, 270)">
          {/* Bucket Body */}
          <path
            d="M 15 35 L 30 140 C 32 148, 108 148, 110 140 L 125 35 Z"
            fill="url(#bucketGrad)"
            stroke="#B45309"
            strokeWidth="3"
          />
          {/* Paint Rim */}
          <ellipse cx="70" cy="35" rx="55" ry="14" fill="#FDE68A" stroke="#B45309" strokeWidth="3" />
          {/* Wet Paint Inside */}
          <ellipse cx="70" cy="37" rx="48" ry="10" fill="#2563EB" />
          {/* Paint Dripping Down Bucket side */}
          <path
            d="M 60 45 C 60 65, 75 75, 70 95 C 68 85, 62 70, 58 45 Z"
            fill="#2563EB"
          />
          {/* Handle Arch */}
          <path
            d="M 12 35 C 10 -15, 128 -15, 128 35"
            fill="none"
            stroke="#64748B"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Label on Bucket */}
          <rect x="42" y="75" width="56" height="34" rx="4" fill="#FFFFFF" opacity="0.95" />
          <line x1="50" y1="86" x2="90" y2="86" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="96" x2="80" y2="96" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 5. MEASURING TAPE (Bottom Left extending) */}
        <g id="measuring-tape" transform="translate(60, 310)">
          {/* Tape Housing */}
          <rect x="0" y="20" width="75" height="65" rx="14" fill="url(#tapeGrad)" stroke="#047857" strokeWidth="3" />
          <circle cx="35" cy="52" r="18" fill="#065F46" />
          <circle cx="35" cy="52" r="10" fill="#10B981" />
          {/* Belt Clip */}
          <rect x="68" y="32" width="6" height="30" rx="2" fill="#E2E8F0" />
          {/* Extended Yellow Tape Blade */}
          <path
            d="M 75 52 L 230 52"
            stroke="#FBBF24"
            strokeWidth="16"
            strokeLinecap="square"
          />
          {/* Tick marks on tape */}
          {[90, 110, 130, 150, 170, 190, 210].map((x) => (
            <line key={x} x1={x} y1="44" x2={x} y2="52" stroke="#78350F" strokeWidth="1.5" />
          ))}
          {/* End Hook */}
          <path d="M 230 44 L 235 44 L 235 64 L 230 64" fill="#475569" />
        </g>

        {/* 6. CALCULATOR FLOATING BADGE (Front Left) */}
        <g id="calculator-badge" transform="translate(40, 140)">
          {/* Device Frame */}
          <rect x="0" y="0" width="90" height="125" rx="14" fill="url(#calcGrad)" stroke="#475569" strokeWidth="2.5" />
          {/* Screen Display */}
          <rect x="10" y="12" width="70" height="26" rx="5" fill="#86EFAC" />
          <text x="74" y="31" fill="#065F46" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="end">
            49.00
          </text>
          {/* Calculator Grid Buttons */}
          <circle cx="22" cy="54" r="6" fill="#334155" />
          <circle cx="45" cy="54" r="6" fill="#334155" />
          <circle cx="68" cy="54" r="6" fill="#2563EB" />

          <circle cx="22" cy="74" r="6" fill="#334155" />
          <circle cx="45" cy="74" r="6" fill="#334155" />
          <circle cx="68" cy="74" r="6" fill="#2563EB" />

          <circle cx="22" cy="94" r="6" fill="#334155" />
          <circle cx="45" cy="94" r="6" fill="#F59E0B" />
          <circle cx="68" cy="94" r="6" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
}
