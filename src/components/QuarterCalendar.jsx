import { useState } from 'react'
import { WEEKS } from '../constants/weeks.js'
import { DAY_ORDER } from '../constants/days.js'
import WeekColumn from './WeekColumn.jsx'
import WeekVisibilityPanel from './WeekVisibilityPanel.jsx'

const INITIAL_EVENTS = {
  'week-0': [{ id: 'event-0', day: 'FRI', startHour: '09', startMinute: '00', endHour: '10', endMinute: '30', title: 'Quarter setup', note: 'Map deadlines and goals.' }],
  'week-1': [
    { id: 'event-1', day: 'MON', startHour: '09', startMinute: '00', endHour: '10', endMinute: '30', title: 'Course kickoff', note: 'Review syllabus and calendar.' },
    { id: 'event-2', day: 'THU', startHour: '14', startMinute: '00', endHour: '15', endMinute: '30', title: 'Study block', note: 'Set up reading notes.' },
  ],
  'week-2': [{ id: 'event-3', day: 'TUE', startHour: '11', startMinute: '30', endHour: '13', endMinute: '00', title: 'Lab prep', note: 'Draft experiment plan.' }],
  'week-3': [{ id: 'event-4', day: 'FRI', startHour: '10', startMinute: '00', endHour: '11', endMinute: '30', title: 'Quiz review', note: 'Practice problem set.' }],
  'week-4': [{ id: 'event-5', day: 'WED', startHour: '15', startMinute: '00', endHour: '16', endMinute: '30', title: 'Office hours', note: 'Bring project questions.' }],
  'week-5': [
    { id: 'event-6', day: 'MON', startHour: '13', startMinute: '00', endHour: '14', endMinute: '30', title: 'Midterm prep', note: 'Outline weak topics.' },
    { id: 'event-7', day: 'SAT', startHour: '10', startMinute: '00', endHour: '12', endMinute: '00', title: 'Deep work', note: 'Finish draft milestone.' },
  ],
  'week-6': [{ id: 'event-8', day: 'THU', startHour: '16', startMinute: '00', endHour: '17', endMinute: '30', title: 'Project check-in', note: 'Review feedback.' }],
  'week-7': [{ id: 'event-9', day: 'TUE', startHour: '09', startMinute: '30', endHour: '11', endMinute: '00', title: 'Reading sprint', note: 'Summarize chapters.' }],
  'week-8': [{ id: 'event-10', day: 'FRI', startHour: '12', startMinute: '00', endHour: '13', endMinute: '30', title: 'Group sync', note: 'Confirm final roles.' }],
  'week-9': [{ id: 'event-11', day: 'WED', startHour: '10', startMinute: '00', endHour: '11', endMinute: '30', title: 'Presentation pass', note: 'Practice timing.' }],
  'week-10': [{ id: 'event-12', day: 'MON', startHour: '15', startMinute: '30', endHour: '17', endMinute: '00', title: 'Wrap-up tasks', note: 'Submit remaining work.' }],
  finals: [
    { id: 'event-13', day: 'TUE', startHour: '08', startMinute: '00', endHour: '09', endMinute: '30', title: 'Final review', note: 'Last full practice exam.' },
    { id: 'event-14', day: 'FRI', startHour: '13', startMinute: '00', endHour: '15', endMinute: '00', title: 'Final exam', note: 'Bring notes and ID.' },
  ],
}

function QuarterCalendar() {
  const [eventsByWeek, setEventsByWeek] = useState(INITIAL_EVENTS)
  const [visibleWeekIds, setVisibleWeekIds] = useState(() => WEEKS.map((week) => week.id))
  const [nextEventId, setNextEventId] = useState(15)
  const [isVisibilityOpen, setVisibilityOpen] = useState(false)

  function handleAddEvent(weekId, eventInput) {
    const event = { ...eventInput, id: `event-${nextEventId}` }

    setEventsByWeek((currentEvents) => ({
      ...currentEvents,
      [weekId]: [...(currentEvents[weekId] ?? []), event],
    }))
    setNextEventId((currentId) => currentId + 1)
  }

  function handleUpdateEvent(weekId, updatedEvent) {
    setEventsByWeek((currentEvents) => ({
      ...currentEvents,
      [weekId]: (currentEvents[weekId] ?? []).map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    }))
  }

  function handleDeleteEvent(weekId, eventId) {
    setEventsByWeek((currentEvents) => ({
      ...currentEvents,
      [weekId]: (currentEvents[weekId] ?? []).filter((event) => event.id !== eventId),
    }))
  }

  function handleToggleWeek(weekId) {
    setVisibleWeekIds((currentWeekIds) =>
      currentWeekIds.includes(weekId)
        ? currentWeekIds.filter((visibleWeekId) => visibleWeekId !== weekId)
        : [...currentWeekIds, weekId],
    )
  }

  const visibleWeeks = WEEKS.filter((week) => visibleWeekIds.includes(week.id))

  function getSortedEvents(weekId) {
    return [...(eventsByWeek[weekId] ?? [])].sort(
      (eventA, eventB) => (DAY_ORDER[eventA.day] ?? 0) - (DAY_ORDER[eventB.day] ?? 0),
    )
  }

  return (
    <section className="calendar-section" aria-label="Quarter calendar">
      <div className="calendar-meta">
        <span>12 week overview</span>
        <span>Scroll horizontally to explore the quarter</span>
        <button className="visibility-button" type="button" onClick={() => setVisibilityOpen(true)}>
          Week Visibility
          <span className="count-badge">{visibleWeekIds.length}/{WEEKS.length}</span>
        </button>
      </div>

      <div className="calendar-scroll" role="region" aria-label="Scrollable weekly calendar">
        <div className="calendar-track">
          {visibleWeeks.map((week) => (
            <WeekColumn
              key={week.id}
              week={week}
              events={getSortedEvents(week.id)}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ))}
        </div>
      </div>

      {isVisibilityOpen ? (
        <WeekVisibilityPanel
          weeks={WEEKS}
          visibleWeekIds={visibleWeekIds}
          onToggleWeek={handleToggleWeek}
          onClose={() => setVisibilityOpen(false)}
        />
      ) : null}
    </section>
  )
}

export default QuarterCalendar
