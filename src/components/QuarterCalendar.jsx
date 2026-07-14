import { useState } from 'react'
import { WEEKS } from '../constants/weeks.js'
import { DAY_ORDER } from '../constants/days.js'
import { getWeekDateRange } from '../lib/calendarDates.js'
import { TODAY_TIME_ZONE_OPTIONS, formatTodayLabel } from '../lib/todayDate.js'
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

function QuarterCalendar({
  activeCalendarId,
  todayTimeZone,
  visibleWeekIds,
  week1Monday,
  eventState,
  onChangeTodayTimeZone,
  onChangeVisibleWeekIds,
  onChangeWeek1Monday,
  onChangeEventState,
}) {
  const [isVisibilityOpen, setVisibilityOpen] = useState(false)
  const [eventClipboard, setEventClipboard] = useState(null)
  const { eventsByWeek, nextEventId } = eventState

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

    onChangeEventState((currentEventState) => ({
      eventsByWeek: {
        ...currentEventState.eventsByWeek,
        [weekId]: [...(currentEventState.eventsByWeek[weekId] ?? []), event],
      },
      nextEventId: currentEventState.nextEventId + 1,
    }))
  }

  function handleUpdateEvent(weekId, updatedEvent) {
    onChangeEventState((currentEventState) => ({
      eventsByWeek: {
        ...currentEventState.eventsByWeek,
        [weekId]: (currentEventState.eventsByWeek[weekId] ?? []).map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      },
      nextEventId: currentEventState.nextEventId,
    }))
  }

  function handleDeleteEvent(weekId, eventId) {
    onChangeEventState((currentEventState) => ({
      eventsByWeek: {
        ...currentEventState.eventsByWeek,
        [weekId]: (currentEventState.eventsByWeek[weekId] ?? []).filter((event) => event.id !== eventId),
      },
      nextEventId: currentEventState.nextEventId,
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

    onChangeEventState((currentEventState) => ({
      eventsByWeek: {
        ...currentEventState.eventsByWeek,
        [weekId]: [...(currentEventState.eventsByWeek[weekId] ?? []), event],
      },
      nextEventId: currentEventState.nextEventId + 1,
    }))
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
        <div className="calendar-date-controls">
          <div className="today-date-picker" aria-label="Set today timezone">
            <select
              aria-label="Today timezone"
              value={todayTimeZone}
              onChange={(event) => onChangeTodayTimeZone(event.target.value)}
            >
              {TODAY_TIME_ZONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span>TODAY: {formatTodayLabel(new Date(), todayTimeZone)}</span>
          </div>

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
        </div>
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
              week1Monday={week1Monday}
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
