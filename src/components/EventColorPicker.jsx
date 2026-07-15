import { DEFAULT_EVENT_COLORS } from '../constants/eventColors.js'

function EventColorPicker({ value, onChange }) {
  const selectedColor = value || ''

  return (
    <div className="event-color-picker">
      <span className="event-color-picker__label">Color</span>
      <div className="event-color-picker__swatches">
        {DEFAULT_EVENT_COLORS.map((color) => (
          <button
            key={color.value}
            className={`event-color-swatch${color.value ? '' : ' event-color-swatch--default'}`}
            type="button"
            aria-label={`Choose ${color.label} event color`}
            aria-pressed={selectedColor === color.value}
            style={color.value ? { backgroundColor: color.value } : undefined}
            onClick={() => onChange(color.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default EventColorPicker
