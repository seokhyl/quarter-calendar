import { useState } from 'react'
import { DAY_OPTIONS } from '../constants/days.js'
import EventCard from './EventCard.jsx'
import EventTimeFields from './EventTimeFields.jsx'

const EMPTY_EVENT = {
  day: '',
  startHour: '',
  startMinute: '',
  endHour: '',
  endMinute: '',
  title: '',
  note: '',
}

function WeekColumn({ week, dateRange, events, onAddEvent, onUpdateEvent, onDeleteEvent, onCopyEvent, onPasteEvent, canPasteEvent }) {
  const isFinals = week.id === 'finals'
  const [isAdding, setIsAdding] = useState(false)
  const [draftEvent, setDraftEvent] = useState(EMPTY_EVENT)

  function handleDraftChange(field, value) {
    setDraftEvent((currentDraft) => ({ ...currentDraft, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!draftEvent.title.trim()) {
      return
    }

    onAddEvent(week.id, {
      day: draftEvent.day,
      startHour: draftEvent.startHour,
      startMinute: draftEvent.startMinute,
      endHour: draftEvent.endHour,
      endMinute: draftEvent.endMinute,
      title: draftEvent.title.trim(),
      note: draftEvent.note.trim(),
    })
    setDraftEvent(EMPTY_EVENT)
    setIsAdding(false)
  }

  return (
    <article className={`week-column${isFinals ? ' week-column--finals' : ''}`}>
      <div className="week-column__header">
        <div className="week-column__title">
          <h2>{week.label}</h2>
          {dateRange ? <p>{dateRange}</p> : null}
        </div>
        <div className="week-column__actions">
          <button
            className="paste-event-button"
            type="button"
            disabled={!canPasteEvent}
            onClick={() => onPasteEvent(week.id)}
          >
            Paste
          </button>
          <button
            className="add-event-button"
            type="button"
            aria-label={`Add event to ${week.label}`}
            onClick={() => setIsAdding((currentValue) => !currentValue)}
          >
            +
          </button>
        </div>
      </div>

      {isAdding ? (
        <form className="event-form" onSubmit={handleSubmit}>
          <label>
            Day
            <select value={draftEvent.day} onChange={(event) => handleDraftChange('day', event.target.value)}>
              {DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <EventTimeFields value={draftEvent} onChange={handleDraftChange} />

          <label>
            Title
            <input
              required
              value={draftEvent.title}
              onChange={(event) => handleDraftChange('title', event.target.value)}
              placeholder="New event"
            />
          </label>
          <label>
            Note
            <textarea
              rows="3"
              value={draftEvent.note}
              onChange={(event) => handleDraftChange('note', event.target.value)}
              placeholder="Optional details"
            />
          </label>
          <div className="form-actions">
            <button className="text-button" type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Add
            </button>
          </div>
        </form>
      ) : null}

      <div className="event-list">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onUpdate={(updatedEvent) => onUpdateEvent(week.id, updatedEvent)}
            onDelete={() => onDeleteEvent(week.id, event.id)}
            onCopy={() => onCopyEvent(event)}
          />
        ))}
      </div>
    </article>
  )
}

export default WeekColumn
