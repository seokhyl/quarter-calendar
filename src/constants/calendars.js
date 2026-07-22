import { WEEKS } from './weeks.js'

const DEFAULT_VISIBLE_WEEK_IDS = WEEKS.filter((week) => week.id !== 'week-0').map((week) => week.id)

const DEFAULT_WEEK_1_MONDAY = { month: '', day: '' }

export const FOLDERS = []

export const CALENDARS = [
  {
    id: 'cal-1',
    name: 'Schedule',
    title: 'Schedule',
    subtitle: '',
    visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
    week1Monday: DEFAULT_WEEK_1_MONDAY,
  },
]

export const DEFAULT_ACTIVE_CALENDAR_ID = 'cal-1'

export { DEFAULT_VISIBLE_WEEK_IDS, DEFAULT_WEEK_1_MONDAY }
