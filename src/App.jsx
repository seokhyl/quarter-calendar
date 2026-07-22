import { useEffect, useState } from 'react'
import {
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
import { loadAppState, saveAppState } from './lib/calendarPersistence.js'
import QuarterCalendar from './components/QuarterCalendar.jsx'
import Sidebar from './components/Sidebar.jsx'

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

function App() {
  const [appState, setAppState] = useState(loadAppState)
  const { folders, calendars, activeCalendarId, todayTimeZone, eventsByWeek, nextEventId } = appState
  const activeCalendar = calendars.find((calendar) => calendar.id === activeCalendarId)

  useEffect(() => {
    saveAppState(appState)
  }, [appState])

  function updateActiveCalendar(updates) {
    setAppState((currentState) => ({
      ...currentState,
      calendars: currentState.calendars.map((calendar) =>
        calendar.id === currentState.activeCalendarId ? { ...calendar, ...updates } : calendar,
      ),
    }))
  }

  function updateEventState(createNextEventState) {
    setAppState((currentState) => ({
      ...currentState,
      ...createNextEventState({
        eventsByWeek: currentState.eventsByWeek,
        nextEventId: currentState.nextEventId,
      }),
    }))
  }

  function handleCreateFolder(name) {
    const folder = { id: createId('folder'), name: name.trim() || 'New Folder' }
    setAppState((currentState) => ({ ...currentState, folders: [...currentState.folders, folder] }))
  }

  function handleCreateCalendar() {
    const calendar = {
      id: createId('cal'),
      name: 'New Calendar',
      title: 'New Calendar',
      subtitle: '',
      visibleWeekIds: DEFAULT_VISIBLE_WEEK_IDS,
      week1Monday: DEFAULT_WEEK_1_MONDAY,
    }
    setAppState((currentState) => ({
      ...currentState,
      calendars: [...currentState.calendars, calendar],
      activeCalendarId: calendar.id,
    }))
  }

  function handleSelectCalendar(calendarId) {
    setAppState((currentState) => ({ ...currentState, activeCalendarId: calendarId }))
  }

  function handleRenameFolder(folderId, name) {
    setAppState((currentState) => ({
      ...currentState,
      folders: renameFolderOp(currentState.folders, folderId, name),
    }))
  }

  function handleRenameCalendar(calendarId, name) {
    setAppState((currentState) => ({
      ...currentState,
      calendars: renameCalendarOp(currentState.calendars, calendarId, name),
    }))
  }

  function handleMoveCalendar(calendarId, folderId) {
    setAppState((currentState) => ({
      ...currentState,
      calendars: moveCalendarOp(currentState.calendars, calendarId, folderId),
    }))
  }

  function handleDeleteFolder(folderId) {
    setAppState((currentState) => ({
      ...currentState,
      ...deleteFolderOp(currentState.folders, currentState.calendars, folderId),
    }))
  }

  function handleDeleteCalendar(calendarId) {
    setAppState((currentState) => {
      const result = deleteCalendarOp(currentState.calendars, calendarId, currentState.activeCalendarId)

      return { ...currentState, calendars: result.calendars, activeCalendarId: result.nextActiveId }
    })
  }

  return (
    <main className="app-shell">
      <div className="app-layout">
        <Sidebar
          folders={folders}
          calendars={calendars}
          activeCalendarId={activeCalendarId}
          onSelectCalendar={handleSelectCalendar}
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
            <div className="header-spacer" aria-hidden="true" />
          </header>

          <QuarterCalendar
            activeCalendarId={activeCalendarId}
            todayTimeZone={todayTimeZone}
            visibleWeekIds={activeCalendar?.visibleWeekIds ?? DEFAULT_VISIBLE_WEEK_IDS}
            week1Monday={activeCalendar?.week1Monday ?? DEFAULT_WEEK_1_MONDAY}
            eventState={{ eventsByWeek, nextEventId }}
            onChangeTodayTimeZone={(todayTimeZone) => setAppState((currentState) => ({ ...currentState, todayTimeZone }))}
            onChangeVisibleWeekIds={(visibleWeekIds) => updateActiveCalendar({ visibleWeekIds })}
            onChangeWeek1Monday={(week1Monday) => updateActiveCalendar({ week1Monday })}
            onChangeEventState={updateEventState}
          />
        </div>
      </div>
    </main>
  )
}

export default App
