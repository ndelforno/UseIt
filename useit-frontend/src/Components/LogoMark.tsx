export const LogoMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" aria-hidden className={className}>
    <circle
      cx="32"
      cy="32"
      r="30"
      className="fill-amber-400/20 stroke-amber-500"
      strokeWidth="2"
    />
    <g
      className="stroke-amber-700"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 41l17-17" />
      <path d="M24 21c-2-2-6-2-8 0s-2 6 0 8m24 14c2 2 6 2 8 0s2-6 0-8" />
      <path d="M27 44l-7 1 1-7" />
      <path d="M45 20l-7 1 1-7" />
    </g>
  </svg>
);
