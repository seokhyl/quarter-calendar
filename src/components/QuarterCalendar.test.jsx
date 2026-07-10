import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WEEKS } from '../constants/weeks.js'
import QuarterCalendar from './QuarterCalendar.jsx'

function renderCalendar(props = {}) {
  return render(
    <QuarterCalendar
      activeCalendarId="cal-1"
      visibleWeekIds={WEEKS.map((week) => week.id)}
      week1Monday={{ month: '3', day: '2' }}
      onChangeVisibleWeekIds={vi.fn()}
      onChangeWeek1Monday={vi.fn()}
      {...props}
    />,
  )
}

function getFormLabelOrder(form) {
  return Array.from(form.querySelectorAll('label, .time-field__label')).map((field) => {
    if (field.matches('label')) {
      return field.childNodes[0].textContent.trim()
    }

    return field.textContent.trim()
  })
}

describe('QuarterCalendar', () => {
  it('renders computed date ranges from Week 1 Monday', () => {
    renderCalendar()

    expect(screen.getByText('2/23 - 3/1')).toBeInTheDocument()
    expect(screen.getByText('3/2 - 3/8')).toBeInTheDocument()
    expect(screen.getByText('5/11 - 5/17')).toBeInTheDocument()
  })

  it('adds, edits, deletes, copies, and pastes events', async () => {
    const user = userEvent.setup()
    renderCalendar()

    await user.click(screen.getByLabelText('Add event to Week 2'))
    const addForm = screen.getByPlaceholderText('New event').closest('form')
    expect(getFormLabelOrder(addForm)).toEqual(['Title', 'Note', 'Day', 'Start', 'End'])

    await user.type(screen.getByPlaceholderText('New event'), 'New checkpoint')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('New checkpoint')).toBeInTheDocument()

    fireEvent.click(screen.getByText('New checkpoint').closest('article').querySelector('button.danger-button'))
    expect(screen.queryByText('New checkpoint')).not.toBeInTheDocument()

    await user.click(screen.getByText('Lab prep').closest('article').querySelector('button.text-button:nth-of-type(2)'))
    const editForm = screen.getByDisplayValue('Lab prep').closest('form')
    expect(getFormLabelOrder(editForm)).toEqual(['Title', 'Note', 'Day', 'Start', 'End'])

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
})
