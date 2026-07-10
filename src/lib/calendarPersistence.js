import { DEFAULT_APP_STATE } from '../constants/appState.js'

export const STORAGE_KEY = 'quarter-calendar:v1'

const STORAGE_VERSION = 1

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isAppState(value) {
  return (
    isObject(value) &&
    Array.isArray(value.folders) &&
    Array.isArray(value.calendars) &&
    typeof value.activeCalendarId === 'string' &&
    isObject(value.eventsByWeek) &&
    Number.isInteger(value.nextEventId)
  )
}

function isSavedPayload(value) {
  return isObject(value) && value.version === STORAGE_VERSION && isAppState(value.state)
}

export function loadAppState() {
  const savedValue = localStorage.getItem(STORAGE_KEY)

  if (!savedValue) {
    return DEFAULT_APP_STATE
  }

  try {
    const parsedValue = JSON.parse(savedValue)

    return isSavedPayload(parsedValue) ? parsedValue.state : DEFAULT_APP_STATE
  } catch (error) {
    if (error instanceof SyntaxError) {
      return DEFAULT_APP_STATE
    }

    throw error
  }
}

export function saveAppState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state }))
}
