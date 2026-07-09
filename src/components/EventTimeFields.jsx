import { HOUR_OPTIONS, MINUTE_OPTIONS } from '../constants/times.js'

function EventTimeFields({ value, onChange }) {
  return (
    <div className="time-fields">
      <div className="time-field">
        <span className="time-field__label">Start</span>
        <div className="time-selects">
          <select
            aria-label="Start hour"
            value={value.startHour}
            onChange={(event) => onChange('startHour', event.target.value)}
          >
            <option value="">--</option>
            {HOUR_OPTIONS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <span className="time-colon">:</span>
          <select
            aria-label="Start minute"
            value={value.startMinute}
            onChange={(event) => onChange('startMinute', event.target.value)}
          >
            <option value="">--</option>
            {MINUTE_OPTIONS.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="time-field">
        <span className="time-field__label">End</span>
        <div className="time-selects">
          <select
            aria-label="End hour"
            value={value.endHour}
            onChange={(event) => onChange('endHour', event.target.value)}
          >
            <option value="">--</option>
            {HOUR_OPTIONS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <span className="time-colon">:</span>
          <select
            aria-label="End minute"
            value={value.endMinute}
            onChange={(event) => onChange('endMinute', event.target.value)}
          >
            <option value="">--</option>
            {MINUTE_OPTIONS.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default EventTimeFields
