export function GeometricBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#1B4332" strokeWidth="0.8" />
          <path d="M40 12L68 40L40 68L12 40Z" fill="none" stroke="#D4A853" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="8" fill="none" stroke="#1B4332" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo)" />
    </svg>
  )
}
