import { useState } from 'react'
import { DAY_OPTIONS } from '../constants/days.js'
import EventTimeFields from './EventTimeFields.jsx'

function formatRange(event) {
  const hasStart = event.startHour && event.startMinute
  const hasEnd = event.endHour && event.endMinute

  if (hasStart && hasEnd) {
    return `${event.startHour}:${event.startMinute} - ${event.endHour}:${event.endMinute}`
  }

  return ''
}

function EventCard({ event, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftEvent, setDraftEvent] = useState(event)

  function handleDraftChange(field, value) {
    setDraftEvent((currentDraft) => ({ ...currentDraft, [field]: value }))
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault()

    if (!draftEvent.title.trim()) {
      return
    }

    onUpdate({
      ...draftEvent,
      title: draftEvent.title.trim(),
      note: draftEvent.note.trim(),
    })
    setIsEditing(false)
  }

  function handleCancel() {
    setDraftEvent(event)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form className="event-card event-card--editing" onSubmit={handleSubmit}>
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
          <input required value={draftEvent.title} onChange={(event) => handleDraftChange('title', event.target.value)} />
        </label>
        <label>
          Note
          <textarea rows="3" value={draftEvent.note} onChange={(event) => handleDraftChange('note', event.target.value)} />
        </label>
        <div className="form-actions">
          <button className="text-button" type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            Save
          </button>
        </div>
      </form>
    )
  }

  return (
    <article className="event-card">
      <p className="event-card__time">
        {event.day ? <span>{event.day}</span> : null}
        {formatRange(event) ? <span className="event-card__range">{formatRange(event)}</span> : null}
      </p>
      <h3>{event.title}</h3>
      <p className="event-card__note">{event.note}</p>
      <div className="event-card__actions">
        <button className="text-button" type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="danger-button" type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default EventCard
