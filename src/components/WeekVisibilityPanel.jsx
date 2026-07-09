import { useEffect } from 'react'

function WeekVisibilityPanel({ weeks, visibleWeekIds, onToggleWeek, onClose }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const visibleCount = weeks.filter((week) => visibleWeekIds.includes(week.id)).length

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="visibility-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Week visibility settings"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="visibility-dialog__header">
          <h2>Week Visibility</h2>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close week visibility">
            ×
          </button>
        </div>

        <div className="visibility-list">
          {weeks.map((week) => (
            <label className="visibility-option" key={week.id}>
              <input
                type="checkbox"
                checked={visibleWeekIds.includes(week.id)}
                onChange={() => onToggleWeek(week.id)}
              />
              <span>{week.label}</span>
            </label>
          ))}
        </div>

        <p className="visibility-summary">
          {visibleCount} of {weeks.length} weeks visible
        </p>
      </div>
    </div>
  )
}

export default WeekVisibilityPanel
