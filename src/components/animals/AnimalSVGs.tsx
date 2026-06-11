import React from 'react';

interface SVGProps {
  size?: number;
  style?: React.CSSProperties;
}

export function CatSVG({ size = 200, style }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden="true">
      {/* Body */}
      <ellipse cx="100" cy="140" rx="55" ry="45" fill="#f5c878" />
      {/* Head */}
      <circle cx="100" cy="85" r="42" fill="#f5c878" />
      {/* Ears */}
      <polygon points="65,50 50,20 82,45" fill="#f5c878" />
      <polygon points="135,50 150,20 118,45" fill="#f5c878" />
      <polygon points="68,48 56,28 80,44" fill="#f0a0a0" />
      <polygon points="132,48 144,28 120,44" fill="#f0a0a0" />
      {/* Eyes */}
      <ellipse cx="84" cy="80" rx="9" ry="10" fill="#4a3520" />
      <ellipse cx="116" cy="80" rx="9" ry="10" fill="#4a3520" />
      <circle cx="87" cy="77" r="3" fill="white" />
      <circle cx="119" cy="77" r="3" fill="white" />
      {/* Nose */}
      <ellipse cx="100" cy="96" rx="5" ry="3.5" fill="#e08080" />
      {/* Mouth */}
      <path d="M96 99 Q100 104 104 99" stroke="#c06060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="55" y1="93" x2="88" y2="97" stroke="#c0a060" strokeWidth="1.5" opacity="0.7" />
      <line x1="55" y1="99" x2="88" y2="99" stroke="#c0a060" strokeWidth="1.5" opacity="0.7" />
      <line x1="112" y1="97" x2="145" y2="93" stroke="#c0a060" strokeWidth="1.5" opacity="0.7" />
      <line x1="112" y1="99" x2="145" y2="99" stroke="#c0a060" strokeWidth="1.5" opacity="0.7" />
      {/* Tail */}
      <path d="M155 155 Q175 130 165 110 Q158 100 162 90" stroke="#f0b060" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="72" cy="178" rx="18" ry="10" fill="#f5c878" />
      <ellipse cx="128" cy="178" rx="18" ry="10" fill="#f5c878" />
    </svg>
  );
}

export function DogSVG({ size = 200, style }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden="true">
      {/* Body */}
      <ellipse cx="100" cy="145" rx="52" ry="42" fill="#c8a878" />
      {/* Head */}
      <circle cx="100" cy="88" r="40" fill="#c8a878" />
      {/* Ears — floppy */}
      <ellipse cx="64" cy="72" rx="16" ry="28" fill="#a07848" transform="rotate(-15 64 72)" />
      <ellipse cx="136" cy="72" rx="16" ry="28" fill="#a07848" transform="rotate(15 136 72)" />
      {/* Snout */}
      <ellipse cx="100" cy="102" rx="22" ry="16" fill="#e8c898" />
      {/* Eyes */}
      <circle cx="85" cy="82" r="8" fill="#3a2510" />
      <circle cx="115" cy="82" r="8" fill="#3a2510" />
      <circle cx="88" cy="79" r="3" fill="white" />
      <circle cx="118" cy="79" r="3" fill="white" />
      {/* Nose */}
      <ellipse cx="100" cy="98" rx="7" ry="5" fill="#3a2510" />
      {/* Nostrils */}
      <ellipse cx="96" cy="100" rx="2" ry="1.5" fill="#2a1500" />
      <ellipse cx="104" cy="100" rx="2" ry="1.5" fill="#2a1500" />
      {/* Mouth */}
      <path d="M94 107 Q100 114 106 107" stroke="#8a6040" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M152 145 Q175 125 170 105" stroke="#c0a070" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="72" cy="180" rx="18" ry="10" fill="#c8a878" />
      <ellipse cx="128" cy="180" rx="18" ry="10" fill="#c8a878" />
    </svg>
  );
}

export function CowSVG({ size = 200, style }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden="true">
      {/* Body */}
      <ellipse cx="100" cy="148" rx="58" ry="42" fill="#f5f0e8" />
      {/* Spots */}
      <ellipse cx="80" cy="145" rx="20" ry="15" fill="#c0b0a0" opacity="0.5" />
      <ellipse cx="120" cy="160" rx="15" ry="12" fill="#c0b0a0" opacity="0.5" />
      {/* Head */}
      <ellipse cx="100" cy="85" rx="38" ry="34" fill="#f5f0e8" />
      {/* Ears */}
      <ellipse cx="64" cy="68" rx="14" ry="10" fill="#f5f0e8" />
      <ellipse cx="136" cy="68" rx="14" ry="10" fill="#f5f0e8" />
      <ellipse cx="64" cy="68" rx="9" ry="6" fill="#f0b0b0" />
      <ellipse cx="136" cy="68" rx="9" ry="6" fill="#f0b0b0" />
      {/* Horns */}
      <path d="M72 60 Q65 40 75 35" stroke="#d4b896" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M128 60 Q135 40 125 35" stroke="#d4b896" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Snout */}
      <ellipse cx="100" cy="104" rx="24" ry="16" fill="#f0c0b0" />
      {/* Nostrils */}
      <circle cx="92" cy="106" r="4" fill="#d09080" />
      <circle cx="108" cy="106" r="4" fill="#d09080" />
      {/* Eyes */}
      <circle cx="84" cy="80" r="8" fill="#2a1a0a" />
      <circle cx="116" cy="80" r="8" fill="#2a1a0a" />
      <circle cx="87" cy="77" r="3" fill="white" />
      <circle cx="119" cy="77" r="3" fill="white" />
      {/* Udder */}
      <ellipse cx="100" cy="188" rx="20" ry="10" fill="#f0b0b0" />
      {/* Legs */}
      <rect x="68" y="175" width="14" height="20" rx="7" fill="#f5f0e8" />
      <rect x="118" y="175" width="14" height="20" rx="7" fill="#f5f0e8" />
    </svg>
  );
}

export function SheepSVG({ size = 200, style }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden="true">
      {/* Fluffy body — cloud of circles */}
      <circle cx="100" cy="145" r="40" fill="#f0eeea" />
      <circle cx="70" cy="148" r="28" fill="#f0eeea" />
      <circle cx="130" cy="148" r="28" fill="#f0eeea" />
      <circle cx="85" cy="125" r="25" fill="#f0eeea" />
      <circle cx="115" cy="125" r="25" fill="#f0eeea" />
      <circle cx="100" cy="118" r="22" fill="#f0eeea" />
      {/* Head */}
      <ellipse cx="100" cy="82" rx="28" ry="26" fill="#d4c8b8" />
      {/* Ears */}
      <ellipse cx="72" cy="82" rx="10" ry="16" fill="#d4c8b8" transform="rotate(-20 72 82)" />
      <ellipse cx="128" cy="82" rx="10" ry="16" fill="#d4c8b8" transform="rotate(20 128 82)" />
      {/* Wool on head */}
      <circle cx="95" cy="64" r="12" fill="#f0eeea" />
      <circle cx="105" cy="62" r="10" fill="#f0eeea" />
      <circle cx="88" cy="68" r="9" fill="#f0eeea" />
      {/* Eyes */}
      <circle cx="88" cy="80" r="6" fill="#2a1a0a" />
      <circle cx="112" cy="80" r="6" fill="#2a1a0a" />
      <circle cx="90" cy="78" r="2" fill="white" />
      <circle cx="114" cy="78" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="100" cy="94" rx="8" ry="5" fill="#c0a090" />
      <circle cx="96" cy="95" r="2.5" fill="#a08070" />
      <circle cx="104" cy="95" r="2.5" fill="#a08070" />
      {/* Legs */}
      <rect x="72" y="178" width="12" height="18" rx="6" fill="#d4c8b8" />
      <rect x="116" y="178" width="12" height="18" rx="6" fill="#d4c8b8" />
    </svg>
  );
}

export function DuckSVG({ size = 200, style }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden="true">
      {/* Body */}
      <ellipse cx="105" cy="148" rx="52" ry="38" fill="#f5d840" />
      {/* Wing detail */}
      <ellipse cx="90" cy="148" rx="35" ry="28" fill="#e8c830" opacity="0.6" />
      {/* Head */}
      <circle cx="130" cy="88" r="30" fill="#f5d840" />
      {/* Bill */}
      <ellipse cx="158" cy="90" rx="16" ry="9" fill="#f09020" />
      <line x1="142" y1="90" x2="174" y2="90" stroke="#e08010" strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="138" cy="80" r="8" fill="#1a1a2a" />
      <circle cx="140" cy="78" r="3" fill="white" />
      {/* Neck */}
      <ellipse cx="118" cy="112" rx="18" ry="14" fill="#f5d840" />
      {/* Tail feather */}
      <path d="M55 140 Q35 120 45 100" stroke="#e8c830" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="82" cy="184" rx="18" ry="8" fill="#f09020" />
      <ellipse cx="118" cy="184" rx="18" ry="8" fill="#f09020" />
      {/* Toe lines */}
      <line x1="68" y1="184" x2="78" y2="190" stroke="#e08010" strokeWidth="2" />
      <line x1="82" y1="185" x2="82" y2="192" stroke="#e08010" strokeWidth="2" />
      <line x1="96" y1="184" x2="88" y2="190" stroke="#e08010" strokeWidth="2" />
    </svg>
  );
}
