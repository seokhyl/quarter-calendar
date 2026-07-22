import { CALENDARS, DEFAULT_ACTIVE_CALENDAR_ID, FOLDERS } from './calendars.js'

export const INITIAL_EVENTS = {
  'week-0': [{ id: 'event-0', calendarId: 'cal-1', day: 'FRI', startHour: '09', startMinute: '00', endHour: '10', endMinute: '30', title: 'Quarter setup', note: 'Map deadlines and goals.' }],
  'week-1': [
    { id: 'event-1', calendarId: 'cal-1', day: 'MON', startHour: '09', startMinute: '00', endHour: '10', endMinute: '30', title: 'Course kickoff', note: 'Review syllabus and calendar.' },
    { id: 'event-2', calendarId: 'cal-1', day: 'THU', startHour: '14', startMinute: '00', endHour: '15', endMinute: '30', title: 'Study block', note: 'Set up reading notes.' },
  ],
  'week-2': [{ id: 'event-3', calendarId: 'cal-1', day: 'TUE', startHour: '11', startMinute: '30', endHour: '13', endMinute: '00', title: 'Lab prep', note: 'Draft experiment plan.' }],
  'week-3': [{ id: 'event-4', calendarId: 'cal-1', day: 'FRI', startHour: '10', startMinute: '00', endHour: '11', endMinute: '30', title: 'Quiz review', note: 'Practice problem set.' }],
  'week-4': [{ id: 'event-5', calendarId: 'cal-1', day: 'WED', startHour: '15', startMinute: '00', endHour: '16', endMinute: '30', title: 'Office hours', note: 'Bring project questions.' }],
  'week-5': [
    { id: 'event-6', calendarId: 'cal-1', day: 'MON', startHour: '13', startMinute: '00', endHour: '14', endMinute: '30', title: 'Midterm prep', note: 'Outline weak topics.' },
    { id: 'event-7', calendarId: 'cal-1', day: 'SAT', startHour: '10', startMinute: '00', endHour: '12', endMinute: '00', title: 'Deep work', note: 'Finish draft milestone.' },
  ],
  'week-6': [{ id: 'event-8', calendarId: 'cal-1', day: 'THU', startHour: '16', startMinute: '00', endHour: '17', endMinute: '30', title: 'Project check-in', note: 'Review feedback.' }],
  'week-7': [{ id: 'event-9', calendarId: 'cal-1', day: 'TUE', startHour: '09', startMinute: '30', endHour: '11', endMinute: '00', title: 'Reading sprint', note: 'Summarize chapters.' }],
  'week-8': [{ id: 'event-10', calendarId: 'cal-1', day: 'FRI', startHour: '12', startMinute: '00', endHour: '13', endMinute: '30', title: 'Group sync', note: 'Confirm final roles.' }],
  'week-9': [{ id: 'event-11', calendarId: 'cal-1', day: 'WED', startHour: '10', startMinute: '00', endHour: '11', endMinute: '30', title: 'Presentation pass', note: 'Practice timing.' }],
  'week-10': [{ id: 'event-12', calendarId: 'cal-1', day: 'MON', startHour: '15', startMinute: '30', endHour: '17', endMinute: '00', title: 'Wrap-up tasks', note: 'Submit remaining work.' }],
  finals: [
    { id: 'event-13', calendarId: 'cal-1', day: 'TUE', startHour: '08', startMinute: '00', endHour: '09', endMinute: '30', title: 'Final review', note: 'Last full practice exam.' },
    { id: 'event-14', calendarId: 'cal-1', day: 'FRI', startHour: '13', startMinute: '00', endHour: '15', endMinute: '00', title: 'Final exam', note: 'Bring notes and ID.' },
  ],
}

export const DEFAULT_NEXT_EVENT_ID = 15

export const DEFAULT_APP_STATE = {
  folders: FOLDERS,
  calendars: CALENDARS,
  activeCalendarId: DEFAULT_ACTIVE_CALENDAR_ID,
  todayTimeZone: 'PST',
  eventsByWeek: INITIAL_EVENTS,
  nextEventId: DEFAULT_NEXT_EVENT_ID,
}
