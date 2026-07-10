import { useState } from 'react'

function SidebarActionMenu({ itemType, itemName, folders, folderId, onRename, onMove, onDelete, onClose }) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState(itemName)
  const canSaveName = Boolean(draftName.trim())

  function submitRename() {
    if (!canSaveName) {
      return
    }

    onRename(draftName)
    setIsRenaming(false)
    onClose()
  }

  return (
    <div className="sidebar-menu" role="menu" aria-label={`${itemName} actions`}>
      {isRenaming ? (
        <div className="sidebar-menu__edit">
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            aria-label={`${itemType} name`}
          />
          <div className="sidebar-menu__actions">
            <button className="text-button" type="button" onClick={() => setIsRenaming(false)}>
              Cancel
            </button>
            <button className="primary-button" type="button" disabled={!canSaveName} onClick={submitRename}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <button className="sidebar-menu__item" type="button" role="menuitem" onClick={() => setIsRenaming(true)}>
          Rename
        </button>
      )}

      {itemType === 'Calendar' ? (
        <label className="sidebar-menu__field">
          Folder
          <select
            value={folderId ?? ''}
            onChange={(event) => {
              onMove(event.target.value)
              onClose()
            }}
          >
            <option value="">No folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <button className="sidebar-menu__item sidebar-menu__item--danger" type="button" role="menuitem" onClick={onDelete}>
        Delete
      </button>
    </div>
  )
}

export default SidebarActionMenu
