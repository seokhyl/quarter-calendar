import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

beforeEach(() => {
  localStorage.clear()
})

function openCalendarMenu(name) {
  fireEvent.click(screen.getByLabelText(`Open calendar actions for ${name}`))
}

function openFolderMenu(name) {
  fireEvent.click(screen.getByLabelText(`Open folder actions for ${name}`))
}

async function createFolder(user, name) {
  await user.click(screen.getByRole('button', { name: 'New folder' }))
  await user.type(screen.getByLabelText('New folder name'), name)
  await user.click(screen.getByRole('button', { name: 'Add' }))
}

async function createCalendar(user, name, folderName = '') {
  await user.click(screen.getByRole('button', { name: 'New calendar' }))
  openCalendarMenu('New Calendar')
  await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
  await user.clear(screen.getByLabelText('Calendar name'))
  await user.type(screen.getByLabelText('Calendar name'), name)
  await user.click(screen.getByRole('button', { name: 'Save' }))

  if (folderName) {
    openCalendarMenu(name)
    const folderOption = screen.getByRole('option', { name: folderName })
    fireEvent.change(screen.getByLabelText('Folder'), { target: { value: folderOption.value } })
  }
}

describe('App feature flows', () => {
  it('starts with an unfiled Schedule calendar and hides Week 0', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Schedule' })).toBeInTheDocument()
    expect(screen.queryByText('School')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Week 0' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Week 1' })).toBeInTheDocument()
  })

  it('creates and selects an unfiled blank calendar immediately', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'New calendar' }))

    expect(screen.getByRole('button', { name: 'New Calendar' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue('New Calendar')
    expect(screen.queryByLabelText('New calendar name')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('New calendar folder')).not.toBeInTheDocument()
  })

  it('closes an open sidebar action menu when clicking outside it', async () => {
    const user = userEvent.setup()
    render(<App />)

    openCalendarMenu('Schedule')
    expect(screen.getByRole('menu', { name: 'Schedule actions' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Week Visibility' }))
    expect(screen.queryByRole('menu', { name: 'Schedule actions' })).not.toBeInTheDocument()
  })

  it('renames folders/calendars, moves calendars, deletes calendars, and toggles week visibility', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createFolder(user, 'School')
    await createFolder(user, 'Personal')
    await createCalendar(user, 'Classes', 'School')
    await createCalendar(user, 'Standalone')

    openFolderMenu('School')
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
    await user.clear(screen.getByLabelText('Folder name'))
    await user.type(screen.getByLabelText('Folder name'), 'Academics')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('button', { name: /Academics 1/ })).toBeInTheDocument()

    openCalendarMenu('Classes')
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
    await user.clear(screen.getByLabelText('Calendar name'))
    await user.type(screen.getByLabelText('Calendar name'), 'Courses')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('button', { name: 'Courses' })).toBeInTheDocument()

    openCalendarMenu('Courses')
    const personalOption = screen.getByRole('option', { name: 'Personal' })
    fireEvent.change(screen.getByLabelText('Folder'), { target: { value: personalOption.value } })
    expect(screen.getByRole('button', { name: /Academics 0/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Personal 1/ })).toBeInTheDocument()

    openCalendarMenu('Standalone')
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }))
    expect(screen.queryByRole('button', { name: 'Standalone' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Week Visibility' }))
    const dialog = screen.getByRole('dialog', { name: 'Week visibility settings' })
    fireEvent.click(within(dialog).getByLabelText('Week 0'))
    expect(screen.getByRole('heading', { name: 'Week 0' })).toBeInTheDocument()
  })

  it('keeps Week 1 Monday dates separate for each calendar', async () => {
    const user = userEvent.setup()
    render(<App />)

    fireEvent.change(screen.getByLabelText('Week 1 Monday month'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Week 1 Monday day'), { target: { value: '2' } })
    expect(screen.getByText('3/2 - 3/8')).toBeInTheDocument()

    await createCalendar(user, 'Assignments')
    await user.click(screen.getByRole('button', { name: 'Assignments' }))
    expect(screen.getByLabelText('Week 1 Monday month')).toHaveValue('')
    expect(screen.queryByText('3/2 - 3/8')).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Week 1 Monday month'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Week 1 Monday day'), { target: { value: '6' } })
    expect(screen.getByText('4/6 - 4/12')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Schedule' }))
    expect(screen.getByLabelText('Week 1 Monday month')).toHaveValue('3')
    expect(screen.getByText('3/2 - 3/8')).toBeInTheDocument()
  })

  it('restores saved calendar and event changes after remounting', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Persisted Quarter')
    fireEvent.change(screen.getByLabelText('Today timezone'), { target: { value: 'PST' } })
    await user.click(screen.getByLabelText('Add event to Week 2'))
    const addForm = screen.getByPlaceholderText('New event').closest('form')
    await user.type(screen.getByPlaceholderText('New event'), 'Saved checkpoint')
    await user.click(within(addForm).getByRole('button', { name: 'Choose Green event color' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))

    unmount()
    render(<App />)

    expect(screen.getByLabelText('Title')).toHaveValue('Persisted Quarter')
    expect(screen.getByLabelText('Today timezone')).toHaveValue('PST')
    expect(screen.getByText('Saved checkpoint')).toBeInTheDocument()
    expect(screen.getByText('Saved checkpoint').closest('article')).toHaveStyle({ backgroundColor: '#dcfce7' })
    expect(JSON.parse(localStorage.getItem('quarter-calendar:v1')).state.eventsByWeek['week-2'].at(-1).color).toBe('#dcfce7')
  })
})
