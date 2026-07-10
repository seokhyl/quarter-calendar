export function renameFolder(folders, folderId, name) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return folders
  }

  return folders.map((folder) => (folder.id === folderId ? { ...folder, name: trimmedName } : folder))
}

export function renameCalendar(calendars, calendarId, name) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return calendars
  }

  return calendars.map((calendar) =>
    calendar.id === calendarId ? { ...calendar, name: trimmedName } : calendar,
  )
}

export function moveCalendar(calendars, calendarId, folderId) {
  return calendars.map((calendar) =>
    calendar.id === calendarId ? { ...calendar, folderId: folderId || undefined } : calendar,
  )
}

export function deleteFolder(folders, calendars, folderId) {
  return {
    folders: folders.filter((folder) => folder.id !== folderId),
    calendars: calendars.map((calendar) =>
      calendar.folderId === folderId ? { ...calendar, folderId: undefined } : calendar,
    ),
  }
}

export function deleteCalendar(calendars, calendarId, activeCalendarId) {
  const nextCalendars = calendars.filter((calendar) => calendar.id !== calendarId)
  const nextActiveId = activeCalendarId === calendarId ? nextCalendars[0]?.id ?? '' : activeCalendarId

  return { calendars: nextCalendars, nextActiveId }
}

export function toggleVisibleWeek(visibleWeekIds, weekId) {
  return visibleWeekIds.includes(weekId)
    ? visibleWeekIds.filter((visibleWeekId) => visibleWeekId !== weekId)
    : [...visibleWeekIds, weekId]
}
