import { useEffect, useState } from 'react'
import SidebarActionMenu from './SidebarActionMenu.jsx'

function Sidebar({
  folders,
  calendars,
  activeCalendarId,
  onSelectCalendar,
  onCreateFolder,
  onCreateCalendar,
  onRenameFolder,
  onRenameCalendar,
  onMoveCalendar,
  onDeleteFolder,
  onDeleteCalendar,
}) {
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [isAddingCalendar, setIsAddingCalendar] = useState(false)
  const [calendarName, setCalendarName] = useState('')
  const [calendarFolderId, setCalendarFolderId] = useState('')
  const [collapsedFolderIds, setCollapsedFolderIds] = useState([])
  const [openMenu, setOpenMenu] = useState(null)

  useEffect(() => {
    if (!openMenu) {
      return undefined
    }

    function handlePointerDown(event) {
      if (event.target.closest('.sidebar-menu') || event.target.closest('.sidebar-more-button')) {
        return
      }

      closeMenu()
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [openMenu])

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

  function toggleMenu(itemType, itemId) {
    setOpenMenu((currentMenu) =>
      currentMenu?.type === itemType && currentMenu.id === itemId ? null : { type: itemType, id: itemId },
    )
  }

  function closeMenu() {
    setOpenMenu(null)
  }

  function renderFolderMenu(folder) {
    if (openMenu?.type !== 'folder' || openMenu.id !== folder.id) {
      return null
    }

    return (
      <SidebarActionMenu
        itemType="Folder"
        itemName={folder.name}
        folders={folders}
        onRename={(name) => onRenameFolder(folder.id, name)}
        onDelete={() => {
          onDeleteFolder(folder.id)
          closeMenu()
        }}
        onClose={closeMenu}
      />
    )
  }

  function renderCalendarMenu(calendar) {
    if (openMenu?.type !== 'calendar' || openMenu.id !== calendar.id) {
      return null
    }

    return (
      <SidebarActionMenu
        itemType="Calendar"
        itemName={calendar.name}
        folders={folders}
        folderId={calendar.folderId}
        onRename={(name) => onRenameCalendar(calendar.id, name)}
        onMove={(folderId) => onMoveCalendar(calendar.id, folderId)}
        onDelete={() => {
          onDeleteCalendar(calendar.id)
          closeMenu()
        }}
        onClose={closeMenu}
      />
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
                className="sidebar-more-button"
                type="button"
                aria-label={`Open folder actions for ${folder.name}`}
                aria-expanded={openMenu?.type === 'folder' && openMenu.id === folder.id}
                onClick={() => toggleMenu('folder', folder.id)}
              >
                ...
              </button>
              {renderFolderMenu(folder)}
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
                      className="sidebar-more-button"
                      type="button"
                      aria-label={`Open calendar actions for ${calendar.name}`}
                      aria-expanded={openMenu?.type === 'calendar' && openMenu.id === calendar.id}
                      onClick={() => toggleMenu('calendar', calendar.id)}
                    >
                      ...
                    </button>
                    {renderCalendarMenu(calendar)}
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
                    className="sidebar-more-button"
                    type="button"
                    aria-label={`Open calendar actions for ${calendar.name}`}
                    aria-expanded={openMenu?.type === 'calendar' && openMenu.id === calendar.id}
                    onClick={() => toggleMenu('calendar', calendar.id)}
                  >
                    ...
                  </button>
                  {renderCalendarMenu(calendar)}
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
