import React from 'react';

interface TempleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
}

export default function TempleIcon({
  className = 'w-6 h-6',
  size = 24,
  strokeWidth = 2,
  ...props
}: TempleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sacred Saffron Flag (Dhwaja) on Top */}
      <path d="M12 2v3l3-1.5L12 2" fill="currentColor" fillOpacity="0.3" />
      
      {/* Kalash Pinnacle */}
      <circle cx="12" cy="5" r="1" fill="currentColor" />

      {/* Main Spire (Shikhara) Tiered Triangle */}
      <path d="M12 6.5L8.5 12h7L12 6.5z" />
      
      {/* Tiered Decorative Ridges */}
      <path d="M10 9.5h4" />
      
      {/* Mandap / Sanctum Eaves */}
      <path d="M5 12h14l1 3H4l1-3z" />

      {/* Pillars & Inner Sanctum Arch */}
      <path d="M6.5 15v5" />
      <path d="M17.5 15v5" />
      <path d="M10 20v-3.5a2 2 0 0 1 4 0V20" />

      {/* Temple Base & Sacred Steps */}
      <path d="M3 20h18" />
      <path d="M2 22h20" />
    </svg>
  );
}
