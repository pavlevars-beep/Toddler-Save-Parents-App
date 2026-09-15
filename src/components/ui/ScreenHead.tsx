import { BackIcon } from '../art/Icons'

/**
 * The header every activity shares: one big round "back" button and a title.
 * The button is large and always in the same corner, so it becomes the one
 * gesture a child learns for "take me home".
 */
export default function ScreenHead({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="screen-head">
      <button className="back-btn" onClick={onBack} aria-label={title}>
        <BackIcon />
      </button>
      <div className="screen-title">{title}</div>
    </div>
  )
}
