import { useState } from 'react'
import {
  FOLDERS,
  CALENDARS,
  DEFAULT_ACTIVE_CALENDAR_ID,
  DEFAULT_VISIBLE_WEEK_IDS,
  DEFAULT_WEEK_1_MONDAY,
} from './constants/calendars.js'
import {
  renameFolder as renameFolderOp,
  renameCalendar as renameCalendarOp,
  moveCalendar as moveCalendarOp,
  deleteFolder as deleteFolderOp,
  deleteCalendar as deleteCalendarOp,
} from './lib/calendarState.js'
import QuarterCalendar from './components/QuarterCalendar.jsx'
import Sidebar from './components/Sidebar.jsx'

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

function App() {
  const [folders, setFolders] = useState(FOLDERS)
  const [calendars, setCalendars] = useState(CALENDARS)
  const [activeCalendarId, setActiveCalendarId] = useState(DEFAULT_ACTIVE_CALENDAR_ID)
  const activeCalendar = calendars.find((calendar) => calendar.id === activeCalendarId)

  function updateActiveCalendar(updates) {
    setCalendars((currentCalendars) =>
      currentCalendars.map((calendar) =>
        calendar.id === activeCalendarId ? { ...calendar, ...updates } : calendar,
      ),
    )
  }

  function handleCreateFolder(name) {
    const folder = { id: createId('folder'), name: name.trim() || 'New Folder' }
    setFolders((currentFolders) => [...currentFolders, folder])
  }

  function handleCreateCalendar(name, folderId) {
    const trimmedName = name.trim() || 'New Calendar'
    const calendar = {
      id: createId('cal'),
      name: trimmedName,
      folderId: folderId || undefined,
      title: trimmedName,
      subtitle: '',
      visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
      week1Monday: DEFAULT_WEEK_1_MONDAY,
    }
    setCalendars((currentCalendars) => [...currentCalendars, calendar])
  }

  function handleRenameFolder(folderId, name) {
    setFolders((currentFolders) => renameFolderOp(currentFolders, folderId, name))
  }

  function handleRenameCalendar(calendarId, name) {
    setCalendars((currentCalendars) => renameCalendarOp(currentCalendars, calendarId, name))
  }

  function handleMoveCalendar(calendarId, folderId) {
    setCalendars((currentCalendars) => moveCalendarOp(currentCalendars, calendarId, folderId))
  }

  function handleDeleteFolder(folderId) {
    const result = deleteFolderOp(folders, calendars, folderId)
    setFolders(result.folders)
    setCalendars(result.calendars)
  }

  function handleDeleteCalendar(calendarId) {
    const result = deleteCalendarOp(calendars, calendarId, activeCalendarId)
    setCalendars(result.calendars)

    if (result.nextActiveId !== activeCalendarId) {
      setActiveCalendarId(result.nextActiveId)
    }
  }

  return (
    <main className="app-shell">
      <div className="app-layout">
        <Sidebar
          folders={folders}
          calendars={calendars}
          activeCalendarId={activeCalendarId}
          onSelectCalendar={setActiveCalendarId}
          onCreateFolder={handleCreateFolder}
          onCreateCalendar={handleCreateCalendar}
          onRenameFolder={handleRenameFolder}
          onRenameCalendar={handleRenameCalendar}
          onMoveCalendar={handleMoveCalendar}
          onDeleteFolder={handleDeleteFolder}
          onDeleteCalendar={handleDeleteCalendar}
        />

        <div className="app-main">
          <header className="app-header">
            <div className="editable-heading">
              <input
                className="header-input header-input--title"
                id="app-title"
                aria-label="Title"
                value={activeCalendar?.title ?? ''}
                onChange={(event) => updateActiveCalendar({ title: event.target.value })}
              />
              <input
                className="header-input header-input--subtitle"
                id="quarter-subtitle"
                aria-label="Subtitle"
                value={activeCalendar?.subtitle ?? ''}
                onChange={(event) => updateActiveCalendar({ subtitle: event.target.value })}
              />
            </div>
            <p className="header-copy">
              Plan from Week 0 through Finals Week, add and revise events, and choose which weeks stay visible.
            </p>
          </header>

          <QuarterCalendar
            activeCalendarId={activeCalendarId}
            visibleWeekIds={activeCalendar?.visibleWeekIds ?? DEFAULT_VISIBLE_WEEK_IDS}
            week1Monday={activeCalendar?.week1Monday ?? DEFAULT_WEEK_1_MONDAY}
            onChangeVisibleWeekIds={(visibleWeekIds) => updateActiveCalendar({ visibleWeekIds })}
            onChangeWeek1Monday={(week1Monday) => updateActiveCalendar({ week1Monday })}
          />
        </div>
      </div>
    </main>
  )
}

export default App
