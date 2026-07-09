import { useState } from 'react'

function Sidebar({
  folders,
  calendars,
  activeCalendarId,
  onSelectCalendar,
  onCreateFolder,
  onCreateCalendar,
  onDeleteFolder,
  onDeleteCalendar,
}) {
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [isAddingCalendar, setIsAddingCalendar] = useState(false)
  const [calendarName, setCalendarName] = useState('')
  const [calendarFolderId, setCalendarFolderId] = useState('')
  const [collapsedFolderIds, setCollapsedFolderIds] = useState([])

  const calendarsByFolder = folders.map((folder) => ({
    folder,
    items: calendars.filter((calendar) => calendar.folderId === folder.id),
    isCollapsed: collapsedFolderIds.includes(folder.id),
  }))
  const unfiledCalendars = calendars.filter((calendar) => !calendar.folderId)

  function submitFolder() {
    onCreateFolder(folderName)
    setFolderName('')
    setIsAddingFolder(false)
  }

  function submitCalendar() {
    onCreateCalendar(calendarName, calendarFolderId || undefined)
    setCalendarName('')
    setCalendarFolderId('')
    setIsAddingCalendar(false)
  }

  function toggleFolder(folderId) {
    setCollapsedFolderIds((currentIds) =>
      currentIds.includes(folderId)
        ? currentIds.filter((currentId) => currentId !== folderId)
        : [...currentIds, folderId],
    )
  }

  return (
    <aside className="sidebar" aria-label="Calendars">
      <div className="sidebar__header">
        <h2>Calendars</h2>
      </div>

      <div className="sidebar__actions">
        <button className="sidebar-button" type="button" onClick={() => setIsAddingFolder((value) => !value)}>
          New folder
        </button>
        <button className="sidebar-button" type="button" onClick={() => setIsAddingCalendar((value) => !value)}>
          New calendar
        </button>
      </div>

      {isAddingFolder ? (
        <div className="sidebar-create">
          <input
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            placeholder="Folder name"
            aria-label="New folder name"
          />
          <div className="form-actions">
            <button className="text-button" type="button" onClick={() => setIsAddingFolder(false)}>
              Cancel
            </button>
            <button className="primary-button" type="button" onClick={submitFolder}>
              Add
            </button>
          </div>
        </div>
      ) : null}

      {isAddingCalendar ? (
        <div className="sidebar-create">
          <input
            value={calendarName}
            onChange={(event) => setCalendarName(event.target.value)}
            placeholder="Calendar name"
            aria-label="New calendar name"
          />
          <select
            value={calendarFolderId}
            onChange={(event) => setCalendarFolderId(event.target.value)}
            aria-label="New calendar folder"
          >
            <option value="">No folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <div className="form-actions">
            <button className="text-button" type="button" onClick={() => setIsAddingCalendar(false)}>
              Cancel
            </button>
            <button className="primary-button" type="button" onClick={submitCalendar}>
              Add
            </button>
          </div>
        </div>
      ) : null}

      <nav className="sidebar__list">
        {calendarsByFolder.map(({ folder, items, isCollapsed }) => (
          <div className="sidebar-group" key={folder.id}>
            <div className="sidebar-group__header">
              <button
                className="sidebar-folder-button"
                type="button"
                aria-expanded={!isCollapsed}
                onClick={() => toggleFolder(folder.id)}
              >
                {folder.name} <span>{items.length}</span>
              </button>
              <button
                className="delete-button"
                type="button"
                aria-label={`Delete folder ${folder.name}`}
                onClick={() => onDeleteFolder(folder.id)}
              >
                x
              </button>
            </div>

            {!isCollapsed ? (
              <ul>
                {items.map((calendar) => (
                  <li className="calendar-row" key={calendar.id}>
                    <button
                      type="button"
                      className={`calendar-item${calendar.id === activeCalendarId ? ' calendar-item--active' : ''}`}
                      onClick={() => onSelectCalendar(calendar.id)}
                    >
                      {calendar.name}
                    </button>
                    <button
                      className="delete-button"
                      type="button"
                      aria-label={`Delete calendar ${calendar.name}`}
                      onClick={() => onDeleteCalendar(calendar.id)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {unfiledCalendars.length > 0 ? (
          <div className="sidebar-group">
            <p className="sidebar-group__title">Unfiled</p>
            <ul>
              {unfiledCalendars.map((calendar) => (
                <li className="calendar-row" key={calendar.id}>
                  <button
                    type="button"
                    className={`calendar-item${calendar.id === activeCalendarId ? ' calendar-item--active' : ''}`}
                    onClick={() => onSelectCalendar(calendar.id)}
                  >
                    {calendar.name}
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    aria-label={`Delete calendar ${calendar.name}`}
                    onClick={() => onDeleteCalendar(calendar.id)}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </aside>
  )
}

export default Sidebar
