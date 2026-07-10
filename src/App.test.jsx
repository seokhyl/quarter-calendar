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

describe('App feature flows', () => {
  it('closes an open sidebar action menu when clicking outside it', async () => {
    const user = userEvent.setup()
    render(<App />)

    openFolderMenu('School')
    expect(screen.getByRole('menu', { name: 'School actions' })).toBeInTheDocument()

    await user.click(screen.getByText(/Plan from Week 0/))
    expect(screen.queryByRole('menu', { name: 'School actions' })).not.toBeInTheDocument()
  })

  it('renames folders/calendars, moves calendars, deletes calendars, and toggles week visibility', async () => {
    const user = userEvent.setup()
    render(<App />)

    openFolderMenu('School')
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
    await user.clear(screen.getByLabelText('Folder name'))
    await user.type(screen.getByLabelText('Folder name'), 'Academics')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('button', { name: /Academics 2/ })).toBeInTheDocument()

    openCalendarMenu('Classes')
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
    await user.clear(screen.getByLabelText('Calendar name'))
    await user.type(screen.getByLabelText('Calendar name'), 'Courses')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('button', { name: 'Courses' })).toBeInTheDocument()

    openCalendarMenu('Courses')
    fireEvent.change(screen.getByLabelText('Folder'), { target: { value: 'folder-2' } })
    expect(screen.getByRole('button', { name: /Academics 1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Personal 2/ })).toBeInTheDocument()

    openCalendarMenu('Standalone')
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }))
    expect(screen.queryByRole('button', { name: 'Standalone' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Week Visibility' }))
    const dialog = screen.getByRole('dialog', { name: 'Week visibility settings' })
    fireEvent.click(within(dialog).getByLabelText('Week 0'))
    expect(screen.queryByRole('heading', { name: 'Week 0' })).not.toBeInTheDocument()
  })

  it('keeps Week 1 Monday dates separate for each calendar', async () => {
    const user = userEvent.setup()
    render(<App />)

    fireEvent.change(screen.getByLabelText('Week 1 Monday month'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Week 1 Monday day'), { target: { value: '2' } })
    expect(screen.getByText('3/2 - 3/8')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Assignments' }))
    expect(screen.getByLabelText('Week 1 Monday month')).toHaveValue('')
    expect(screen.queryByText('3/2 - 3/8')).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Week 1 Monday month'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Week 1 Monday day'), { target: { value: '6' } })
    expect(screen.getByText('4/6 - 4/12')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Classes' }))
    expect(screen.getByLabelText('Week 1 Monday month')).toHaveValue('3')
    expect(screen.getByText('3/2 - 3/8')).toBeInTheDocument()
  })

  it('restores saved calendar and event changes after remounting', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Persisted Quarter')
    await user.click(screen.getByLabelText('Add event to Week 2'))
    await user.type(screen.getByPlaceholderText('New event'), 'Saved checkpoint')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    unmount()
    render(<App />)

    expect(screen.getByLabelText('Title')).toHaveValue('Persisted Quarter')
    expect(screen.getByText('Saved checkpoint')).toBeInTheDocument()
  })
})
