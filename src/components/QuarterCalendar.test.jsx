import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_APP_STATE } from '../constants/appState.js'
import { WEEKS } from '../constants/weeks.js'
import QuarterCalendar from './QuarterCalendar.jsx'

function renderCalendar(props = {}) {
  function TestCalendar() {
    const [calendarState, setCalendarState] = useState({
      visibleWeekIds: props.visibleWeekIds ?? WEEKS.map((week) => week.id),
      week1Monday: props.week1Monday ?? { month: '3', day: '2' },
    })
    const [eventState, setEventState] = useState({
      eventsByWeek: props.eventsByWeek ?? DEFAULT_APP_STATE.eventsByWeek,
      nextEventId: props.nextEventId ?? DEFAULT_APP_STATE.nextEventId,
    })
    const [todayTimeZone, setTodayTimeZone] = useState(props.todayTimeZone ?? DEFAULT_APP_STATE.todayTimeZone)

    function handleChangeEventState(createNextEventState) {
      setEventState((currentEventState) => ({ ...currentEventState, ...createNextEventState(currentEventState) }))
    }

    return (
      <QuarterCalendar
        activeCalendarId="cal-1"
        todayTimeZone={todayTimeZone}
        visibleWeekIds={calendarState.visibleWeekIds}
        week1Monday={calendarState.week1Monday}
        eventState={eventState}
        onChangeTodayTimeZone={setTodayTimeZone}
        onChangeVisibleWeekIds={(visibleWeekIds) => setCalendarState((currentState) => ({ ...currentState, visibleWeekIds }))}
        onChangeWeek1Monday={(week1Monday) => setCalendarState((currentState) => ({ ...currentState, week1Monday }))}
        onChangeEventState={handleChangeEventState}
        {...props}
      />
    )
  }

  return render(<TestCalendar />)
}

function getFormLabelOrder(form) {
  return Array.from(form.querySelectorAll('label, .time-field__label, .event-color-picker__label')).map((field) => {
    if (field.matches('label')) {
      return field.childNodes[0].textContent.trim()
    }

    return field.textContent.trim()
  })
}

describe('QuarterCalendar', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders computed date ranges from Week 1 Monday', () => {
    renderCalendar()

    expect(screen.getByText('2/23 - 3/1')).toBeInTheDocument()
    expect(screen.getByText('3/2 - 3/8')).toBeInTheDocument()
    expect(screen.getByText('5/11 - 5/17')).toBeInTheDocument()
  })

  it('shows event metadata as date, day, then time when Week 1 Monday is set', () => {
    renderCalendar()

    const labPrepMetadata = screen.getByText('Lab prep').closest('article').querySelector('.event-card__time')

    expect(Array.from(labPrepMetadata.children).map((child) => child.textContent)).toEqual([
      '3/10',
      '화',
      '11:30 - 13:00',
    ])
  })

  it('shows today in the selected timezone above the Week 1 Monday picker', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-01T06:00:00.000Z'))
    renderCalendar()

    expect(screen.getByText('TODAY: 2026/7/1 (수)')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Today timezone'), { target: { value: 'PST' } })

    expect(screen.getByText('TODAY: 2026/6/30 (화)')).toBeInTheDocument()
  })

  it('adds, edits, deletes, copies, and pastes events', async () => {
    const user = userEvent.setup()
    renderCalendar()

    await user.click(screen.getByLabelText('Add event to Week 2'))
    const addForm = screen.getByPlaceholderText('New event').closest('form')
    expect(getFormLabelOrder(addForm)).toEqual(['Title', 'Note', 'Day', 'Start', 'End', 'Color'])

    await user.type(screen.getByPlaceholderText('New event'), 'New checkpoint')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('New checkpoint')).toBeInTheDocument()
    expect(screen.getByText('New checkpoint').closest('article').style.backgroundColor).toBe('')

    fireEvent.click(screen.getByText('New checkpoint').closest('article').querySelector('button.danger-button'))
    expect(screen.queryByText('New checkpoint')).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('Add event to Week 2'))
    const coloredAddForm = screen.getByPlaceholderText('New event').closest('form')
    await user.type(screen.getByPlaceholderText('New event'), 'New checkpoint')
    await user.click(within(coloredAddForm).getByRole('button', { name: 'Choose Green event color' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('New checkpoint')).toBeInTheDocument()
    expect(screen.getByText('New checkpoint').closest('article')).toHaveStyle({ backgroundColor: '#dcfce7' })

    fireEvent.click(screen.getByText('New checkpoint').closest('article').querySelector('button.danger-button'))
    expect(screen.queryByText('New checkpoint')).not.toBeInTheDocument()

    await user.click(screen.getByText('Lab prep').closest('article').querySelector('button.text-button:nth-of-type(2)'))
    const editForm = screen.getByDisplayValue('Lab prep').closest('form')
    expect(getFormLabelOrder(editForm)).toEqual(['Title', 'Note', 'Day', 'Start', 'End', 'Color'])

    const editTitle = screen.getByDisplayValue('Lab prep')
    await user.clear(editTitle)
    await user.type(editTitle, 'Updated lab prep')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByText('Updated lab prep')).toBeInTheDocument()

    const week1Card = screen.getByText('Course kickoff').closest('article')
    await user.click(within(week1Card).getByRole('button', { name: 'Copy' }))

    const week2Column = screen.getByRole('heading', { name: 'Week 2' }).closest('article')
    await user.click(within(week2Column).getByRole('button', { name: 'Paste' }))
    expect(within(week2Column).getByText('Course kickoff')).toBeInTheDocument()
  })

  it('records custom event colors so they remain selectable', async () => {
    const user = userEvent.setup()
    renderCalendar()

    await user.click(screen.getByLabelText('Add event to Week 2'))
    const addForm = screen.getByPlaceholderText('New event').closest('form')

    expect(within(addForm).getAllByRole('button', { name: /event color/ })).toHaveLength(8)
    expect(within(addForm).getByRole('button', { name: 'Choose Default event color' })).toBeInTheDocument()
    expect(within(addForm).queryByLabelText('Custom event color')).not.toBeInTheDocument()
  })

  it('uses the default swatch to clear a selected event color', async () => {
    const user = userEvent.setup()
    renderCalendar()

    await user.click(screen.getByLabelText('Add event to Week 2'))
    const addForm = screen.getByPlaceholderText('New event').closest('form')

    await user.click(within(addForm).getByRole('button', { name: 'Choose Green event color' }))
    await user.click(within(addForm).getByRole('button', { name: 'Choose Default event color' }))
    await user.type(screen.getByPlaceholderText('New event'), 'Default swatch check')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('Default swatch check').closest('article').style.backgroundColor).toBe('')
  })
})
