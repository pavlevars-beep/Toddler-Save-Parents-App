import { useHoldPress } from '../../hooks/useHoldPress'
import { LeafIcon } from '../art/Icons'
import ProgressRing from './ProgressRing'

/**
 * The way into the parent area: a small, faded leaf in the corner that only
 * opens after two seconds of steady pressure. A toddler taps it and nothing
 * happens, which is the point.
 */
export default function ParentDoor({ onOpen, label }: { onOpen: () => void; label: string }) {
  const { progress, handlers } = useHoldPress(onOpen, 2000)
  return (
    <button className="parent-door" data-holding={progress > 0} aria-label={label} {...handlers}>
      <ProgressRing progress={progress} size={56} className="hold-ring" />
      <LeafIcon />
    </button>
  )
}
