type ShortcutItem = {
  keys: string
  action: string
}

type ShortcutOverlayProps = {
  open: boolean
  onClose: () => void
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: '?', action: 'Open keyboard shortcuts' },
  { keys: 'Esc', action: 'Close open overlay' },
  { keys: 'T', action: 'Open product tour' },
  { keys: 'Shift + /', action: 'Alternate way to open shortcuts' },
]

export const ShortcutOverlay = ({ open, onClose }: ShortcutOverlayProps) => {
  if (!open) {
    return null
  }

  return (
    <div className="tour-backdrop" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="tour-card shortcut-card">
        <div className="tour-progress">Keyboard Shortcuts</div>
        <h3>Speed Up Workflow Design</h3>
        <p>Use these shortcuts while building and testing workflows.</p>

        <ul className="shortcut-list">
          {SHORTCUTS.map((item) => (
            <li key={item.keys}>
              <kbd>{item.keys}</kbd>
              <span>{item.action}</span>
            </li>
          ))}
        </ul>

        <div className="tour-actions">
          <button type="button" className="run-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
