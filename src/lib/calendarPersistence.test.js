import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_APP_STATE } from '../constants/appState.js'
import { loadAppState, saveAppState, STORAGE_KEY } from './calendarPersistence.js'

describe('calendar persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the default app state when saved data is missing', () => {
    expect(loadAppState()).toEqual(DEFAULT_APP_STATE)
  })

  it('loads a valid saved app state', () => {
    const savedState = {
      ...DEFAULT_APP_STATE,
      activeCalendarId: 'cal-2',
      calendars: DEFAULT_APP_STATE.calendars.map((calendar) =>
        calendar.id === 'cal-2' ? { ...calendar, title: 'Saved Assignments' } : calendar,
      ),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state: savedState }))

    expect(loadAppState()).toEqual(savedState)
  })

  it('returns the default app state when saved data is invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid')

    expect(loadAppState()).toEqual(DEFAULT_APP_STATE)
  })

  it('returns the default app state when saved data has an unsupported version', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, state: DEFAULT_APP_STATE }))

    expect(loadAppState()).toEqual(DEFAULT_APP_STATE)
  })

  it('saves the app state as a versioned payload', () => {
    const nextState = { ...DEFAULT_APP_STATE, activeCalendarId: 'cal-3' }

    saveAppState(nextState)

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({ version: 1, state: nextState })
  })
})
