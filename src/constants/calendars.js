import { WEEKS } from './weeks.js'

const DEFAULT_VISIBLE_WEEK_IDS = WEEKS.map((week) => week.id)

export const FOLDERS = [
  { id: 'folder-1', name: 'School' },
  { id: 'folder-2', name: 'Personal' },
]

export const CALENDARS = [
  {
    id: 'cal-1',
    name: 'Classes',
    folderId: 'folder-1',
    title: 'Quarter Calendar',
    subtitle: '',
    visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
  },
  {
    id: 'cal-2',
    name: 'Assignments',
    folderId: 'folder-1',
    title: 'Assignments Calendar',
    subtitle: '',
    visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
  },
  {
    id: 'cal-3',
    name: 'Personal',
    folderId: 'folder-2',
    title: 'Personal Calendar',
    subtitle: '',
    visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
  },
  {
    id: 'cal-4',
    name: 'Standalone',
    folderId: undefined,
    title: 'Standalone Calendar',
    subtitle: '',
    visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
  },
]

export const DEFAULT_ACTIVE_CALENDAR_ID = 'cal-1'

export { DEFAULT_VISIBLE_WEEK_IDS }
