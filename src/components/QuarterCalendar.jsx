import { useState } from 'react'
import { WEEKS } from '../constants/weeks.js'
import { DAY_ORDER } from '../constants/days.js'
import { getWeekDateRange } from '../lib/calendarDates.js'
import WeekColumn from './WeekColumn.jsx'
import WeekVisibilityPanel from './WeekVisibilityPanel.jsx'

const MONTH_OPTIONS = [
  { value: '1', label: 'Jan', days: 31 },
  { value: '2', label: 'Feb', days: 28 },
  { value: '3', label: 'Mar', days: 31 },
  { value: '4', label: 'Apr', days: 30 },
  { value: '5', label: 'May', days: 31 },
  { value: '6', label: 'Jun', days: 30 },
  { value: '7', label: 'Jul', days: 31 },
  { value: '8', label: 'Aug', days: 31 },
  { value: '9', label: 'Sep', days: 30 },
  { value: '10', label: 'Oct', days: 31 },
  { value: '11', label: 'Nov', days: 30 },
  { value: '12', label: 'Dec', days: 31 },
]

const INITIAL_EVENTS = {
  'week-0': [{ id: 'event-0', calendarId: 'cal-1', day: 'FRI', startHour: '09', startMinute: '00', endHour: '10', endMinute: '30', title: 'Quarter setup', note: 'Map deadlines and goals.' }],
  'week-1': [
    { id: 'event-1', calendarId: 'cal-1', day: 'MON', startHour: '09', startMinute: '00', endHour: '10', endMinute: '30', title: 'Course kickoff', note: 'Review syllabus and calendar.' },
    { id: 'event-2', calendarId: 'cal-1', day: 'THU', startHour: '14', startMinute: '00', endHour: '15', endMinute: '30', title: 'Study block', note: 'Set up reading notes.' },
  ],
  'week-2': [{ id: 'event-3', calendarId: 'cal-1', day: 'TUE', startHour: '11', startMinute: '30', endHour: '13', endMinute: '00', title: 'Lab prep', note: 'Draft experiment plan.' }],
  'week-3': [{ id: 'event-4', calendarId: 'cal-1', day: 'FRI', startHour: '10', startMinute: '00', endHour: '11', endMinute: '30', title: 'Quiz review', note: 'Practice problem set.' }],
  'week-4': [{ id: 'event-5', calendarId: 'cal-1', day: 'WED', startHour: '15', startMinute: '00', endHour: '16', endMinute: '30', title: 'Office hours', note: 'Bring project questions.' }],
  'week-5': [
    { id: 'event-6', calendarId: 'cal-1', day: 'MON', startHour: '13', startMinute: '00', endHour: '14', endMinute: '30', title: 'Midterm prep', note: 'Outline weak topics.' },
    { id: 'event-7', calendarId: 'cal-1', day: 'SAT', startHour: '10', startMinute: '00', endHour: '12', endMinute: '00', title: 'Deep work', note: 'Finish draft milestone.' },
  ],
  'week-6': [{ id: 'event-8', calendarId: 'cal-1', day: 'THU', startHour: '16', startMinute: '00', endHour: '17', endMinute: '30', title: 'Project check-in', note: 'Review feedback.' }],
  'week-7': [{ id: 'event-9', calendarId: 'cal-1', day: 'TUE', startHour: '09', startMinute: '30', endHour: '11', endMinute: '00', title: 'Reading sprint', note: 'Summarize chapters.' }],
  'week-8': [{ id: 'event-10', calendarId: 'cal-1', day: 'FRI', startHour: '12', startMinute: '00', endHour: '13', endMinute: '30', title: 'Group sync', note: 'Confirm final roles.' }],
  'week-9': [{ id: 'event-11', calendarId: 'cal-1', day: 'WED', startHour: '10', startMinute: '00', endHour: '11', endMinute: '30', title: 'Presentation pass', note: 'Practice timing.' }],
  'week-10': [{ id: 'event-12', calendarId: 'cal-1', day: 'MON', startHour: '15', startMinute: '30', endHour: '17', endMinute: '00', title: 'Wrap-up tasks', note: 'Submit remaining work.' }],
  finals: [
    { id: 'event-13', calendarId: 'cal-1', day: 'TUE', startHour: '08', startMinute: '00', endHour: '09', endMinute: '30', title: 'Final review', note: 'Last full practice exam.' },
    { id: 'event-14', calendarId: 'cal-1', day: 'FRI', startHour: '13', startMinute: '00', endHour: '15', endMinute: '00', title: 'Final exam', note: 'Bring notes and ID.' },
  ],
}

function QuarterCalendar({
  activeCalendarId,
  visibleWeekIds,
  week1Monday,
  onChangeVisibleWeekIds,
  onChangeWeek1Monday,
}) {
  const [eventsByWeek, setEventsByWeek] = useState(INITIAL_EVENTS)
  const [nextEventId, setNextEventId] = useState(15)
  const [isVisibilityOpen, setVisibilityOpen] = useState(false)
  const [eventClipboard, setEventClipboard] = useState(null)

  const selectedMonth = MONTH_OPTIONS.find((month) => month.value === week1Monday.month)
  const dayOptions = selectedMonth
    ? Array.from({ length: selectedMonth.days }, (_, dayIndex) => String(dayIndex + 1))
    : []

  function handleWeek1MonthChange(month) {
    const nextMonth = MONTH_OPTIONS.find((monthOption) => monthOption.value === month)
    const currentDay = Number(week1Monday.day)
    const nextDay = nextMonth ? String(Math.min(currentDay || 1, nextMonth.days)) : ''

    onChangeWeek1Monday({ month, day: nextDay })
  }

  function handleAddEvent(weekId, eventInput) {
    const event = { ...eventInput, id: `event-${nextEventId}`, calendarId: activeCalendarId }

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

  function handleCopyEvent(event) {
    const { id, calendarId, ...eventContents } = event
    setEventClipboard(eventContents)
  }

  function handlePasteEvent(weekId) {
    if (!eventClipboard) {
      return
    }

    const event = { ...eventClipboard, id: `event-${nextEventId}`, calendarId: activeCalendarId }

    setEventsByWeek((currentEvents) => ({
      ...currentEvents,
      [weekId]: [...(currentEvents[weekId] ?? []), event],
    }))
    setNextEventId((currentId) => currentId + 1)
  }

  function handleToggleWeek(weekId) {
    const nextVisibleWeekIds = visibleWeekIds.includes(weekId)
      ? visibleWeekIds.filter((visibleWeekId) => visibleWeekId !== weekId)
      : [...visibleWeekIds, weekId]

    onChangeVisibleWeekIds(nextVisibleWeekIds)
  }

  const visibleWeeks = WEEKS.filter((week) => visibleWeekIds.includes(week.id))

  function getSortedEvents(weekId) {
    return [...(eventsByWeek[weekId] ?? [])]
      .filter((event) => event.calendarId === activeCalendarId)
      .sort((eventA, eventB) => (DAY_ORDER[eventA.day] ?? 0) - (DAY_ORDER[eventB.day] ?? 0))
  }

  return (
    <section className="calendar-section" aria-label="Quarter calendar">
      <div className="calendar-meta">
        <div className="week-date-picker" aria-label="Set Week 1 Monday date">
          <span>Week 1 Monday</span>
          <select
            aria-label="Week 1 Monday month"
            value={week1Monday.month}
            onChange={(event) => handleWeek1MonthChange(event.target.value)}
          >
            <option value="">Month</option>
            {MONTH_OPTIONS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Week 1 Monday day"
            disabled={!selectedMonth}
            value={week1Monday.day}
            onChange={(event) => onChangeWeek1Monday({ ...week1Monday, day: event.target.value })}
          >
            <option value="">Day</option>
            {dayOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <span>Scroll horizontally to explore the quarter</span>
        <button className="visibility-button" type="button" onClick={() => setVisibilityOpen(true)}>
          Week Visibility
        </button>
      </div>

      <div className="calendar-scroll" role="region" aria-label="Scrollable weekly calendar">
        <div className="calendar-track">
          {visibleWeeks.map((week) => (
            <WeekColumn
              key={week.id}
              week={week}
              dateRange={getWeekDateRange(week.id, week1Monday)}
              events={getSortedEvents(week.id)}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onCopyEvent={handleCopyEvent}
              onPasteEvent={handlePasteEvent}
              canPasteEvent={Boolean(eventClipboard)}
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
