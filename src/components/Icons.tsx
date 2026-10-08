import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** Inline SVG icons (currentColor, 24x24 grid) used across the UI. */
const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const SendIcon = (props: IconProps) => (
  <svg {...base(props)} aria-hidden="true">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
);

export const PlusIcon = (props: IconProps) => (
  <svg {...base(props)} aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base(props)} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <svg {...base(props)} aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const LogoutIcon = (props: IconProps) => (
  <svg {...base(props)} aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base({ width: 14, height: 14, ...props })} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const DoubleCheckIcon = (props: IconProps) => (
  <svg {...base({ width: 16, height: 14, ...props })} aria-hidden="true">
    <path d="M1 13l4 4L15 7" />
    <path d="M9 13l4 4L23 7" />
  </svg>
);

export const AlertIcon = (props: IconProps) => (
  <svg {...base({ width: 14, height: 14, ...props })} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...base({ width: 14, height: 14, ...props })} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
