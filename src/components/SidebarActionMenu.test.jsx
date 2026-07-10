import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SidebarActionMenu from './SidebarActionMenu.jsx'

const folders = [
  { id: 'folder-1', name: 'School' },
  { id: 'folder-2', name: 'Personal' },
]

describe('SidebarActionMenu', () => {
  it('renames a folder through the inline rename form', () => {
    const onRename = vi.fn()
    const onClose = vi.fn()

    render(
      <SidebarActionMenu
        itemType="Folder"
        itemName="School"
        folders={folders}
        onRename={onRename}
        onDelete={vi.fn()}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }))
    fireEvent.change(screen.getByLabelText('Folder name'), { target: { value: 'Academics' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onRename).toHaveBeenCalledWith('Academics')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('prevents saving a blank rename', () => {
    render(
      <SidebarActionMenu
        itemType="Folder"
        itemName="School"
        folders={folders}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }))
    fireEvent.change(screen.getByLabelText('Folder name'), { target: { value: '   ' } })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('moves a calendar with the folder selector and can delete it', () => {
    const onMove = vi.fn()
    const onDelete = vi.fn()
    const onClose = vi.fn()

    render(
      <SidebarActionMenu
        itemType="Calendar"
        itemName="Classes"
        folders={folders}
        folderId="folder-1"
        onRename={vi.fn()}
        onMove={onMove}
        onDelete={onDelete}
        onClose={onClose}
      />,
    )

    fireEvent.change(screen.getByLabelText('Folder'), { target: { value: 'folder-2' } })
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))

    expect(onMove).toHaveBeenCalledWith('folder-2')
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
