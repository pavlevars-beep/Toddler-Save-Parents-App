/** A circular progress stroke — used for hold-to-open and record countdown. */
export default function ProgressRing({
  progress,
  size = 56,
  stroke = 5,
  color = '#93aa84',
  className,
}: {
  progress: number
  size?: number
  stroke?: number
  color?: string
  className?: string
}) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true" focusable="false">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - Math.min(1, Math.max(0, progress)))}
        opacity={progress > 0 ? 1 : 0}
      />
    </svg>
  )
}
