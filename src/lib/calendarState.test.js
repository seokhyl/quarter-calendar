import { describe, expect, it } from 'vitest'
import {
  deleteCalendar,
  deleteFolder,
  moveCalendar,
  renameCalendar,
  renameFolder,
  toggleVisibleWeek,
} from './calendarState.js'

const folders = [
  { id: 'folder-1', name: 'School' },
  { id: 'folder-2', name: 'Personal' },
]

const calendars = [
  { id: 'cal-1', name: 'Classes', folderId: 'folder-1', title: 'Quarter Calendar' },
  { id: 'cal-2', name: 'Assignments', folderId: 'folder-1', title: 'Assignments Calendar' },
  { id: 'cal-3', name: 'Personal', folderId: 'folder-2', title: 'Personal Calendar' },
]

describe('calendar and folder state operations', () => {
  it('renames folders and ignores blank names', () => {
    expect(renameFolder(folders, 'folder-1', 'Academics')[0].name).toBe('Academics')
    expect(renameFolder(folders, 'folder-1', '   ')).toBe(folders)
  })

  it('renames sidebar calendars without changing the calendar title', () => {
    const result = renameCalendar(calendars, 'cal-1', 'Courses')

    expect(result[0].name).toBe('Courses')
    expect(result[0].title).toBe('Quarter Calendar')
    expect(renameCalendar(calendars, 'cal-1', '')).toBe(calendars)
  })

  it('moves calendars between folders and into the unfiled group', () => {
    const moved = moveCalendar(calendars, 'cal-1', 'folder-2')
    const unfiled = moveCalendar(moved, 'cal-1', '')

    expect(moved[0].folderId).toBe('folder-2')
    expect(unfiled[0].folderId).toBeUndefined()
  })

  it('deleting a folder keeps its calendars but clears their folder id', () => {
    const result = deleteFolder(folders, calendars, 'folder-1')

    expect(result.folders).toEqual([{ id: 'folder-2', name: 'Personal' }])
    expect(result.calendars.find((calendar) => calendar.id === 'cal-1').folderId).toBeUndefined()
    expect(result.calendars.find((calendar) => calendar.id === 'cal-3').folderId).toBe('folder-2')
  })

  it('deleting the active calendar selects the first remaining calendar', () => {
    const deletedActive = deleteCalendar(calendars, 'cal-1', 'cal-1')
    const deletedInactive = deleteCalendar(calendars, 'cal-2', 'cal-1')

    expect(deletedActive.calendars.map((calendar) => calendar.id)).toEqual(['cal-2', 'cal-3'])
    expect(deletedActive.nextActiveId).toBe('cal-2')
    expect(deletedInactive.nextActiveId).toBe('cal-1')
  })

  it('toggles visible weeks without mutating the original list', () => {
    const visibleWeeks = ['week-0', 'week-1']

    expect(toggleVisibleWeek(visibleWeeks, 'week-1')).toEqual(['week-0'])
    expect(toggleVisibleWeek(visibleWeeks, 'week-2')).toEqual(['week-0', 'week-1', 'week-2'])
    expect(visibleWeeks).toEqual(['week-0', 'week-1'])
  })
})
