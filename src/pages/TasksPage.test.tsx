import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TasksPage from './TasksPage'
import { loadTasks, saveTasks } from '../taskStorage'

describe('Tasks page', (): void => {
  it('adds a trimmed task by keyboard, toggles it, and persists deletion across remounts', async (): Promise<void> => {
    const user = userEvent.setup()
    const first = render(<TasksPage />)
    expect(screen.getByText(/No tasks yet/)).toBeVisible()
    await user.tab()
    expect(screen.getByRole('textbox', { name: 'New task' })).toHaveFocus()
    await user.keyboard('  Read a book  {Enter}')
    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(screen.getByRole('status')).toHaveTextContent('Added "Read a book".')
    await user.click(screen.getByRole('checkbox', { name: /Read a book/ }))
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(loadTasks().tasks[0]).toMatchObject({ title: 'Read a book', completed: true })
    first.unmount()

    const second = render(<TasksPage />)
    expect(screen.getByRole('checkbox', { name: /Read a book/ })).toBeChecked()
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(loadTasks().tasks[0].completed).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Delete Read a book' }))
    expect(screen.getByRole('textbox')).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Deleted "Read a book".')
    second.unmount()

    render(<TasksPage />)
    expect(screen.getByText(/No tasks yet/)).toBeVisible()
  })

  it('rejects whitespace-only titles with an associated error and input focus', async (): Promise<void> => {
    const user = userEvent.setup()
    render(<TasksPage />)
    await user.type(screen.getByRole('textbox'), '   ')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    const input = screen.getByRole('textbox', { name: 'New task' })
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Enter a task title.')
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.type(input, 'Valid')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('preserves task order and moves focus to the next, then previous surviving delete button', async (): Promise<void> => {
    saveTasks([
      { id: 'a', title: 'First', completed: false },
      { id: 'b', title: 'Second', completed: true },
      { id: 'c', title: 'Third', completed: false },
    ])
    const user = userEvent.setup()
    render(<TasksPage />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toHaveAccessibleName('First To do')
    expect(checkboxes[1]).toHaveAccessibleName('Second Complete')
    expect(checkboxes[2]).toHaveAccessibleName('Third To do')
    await user.click(screen.getByRole('button', { name: 'Delete Second' }))
    expect(screen.getByRole('button', { name: 'Delete Third' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Delete Third' }))
    expect(screen.getByRole('button', { name: 'Delete First' })).toHaveFocus()
  })

  it('keeps task identities separate when titles match', async (): Promise<void> => {
    const user = userEvent.setup()
    render(<TasksPage />)
    for (const title of ['Repeat', 'Repeat']) {
      await user.type(screen.getByRole('textbox'), title)
      await user.click(screen.getByRole('button', { name: 'Add task' }))
    }
    await user.click(screen.getAllByRole('checkbox')[1])
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked()
    await user.click(screen.getAllByRole('button', { name: 'Delete Repeat' })[0])
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it.each(['{broken', '[{"id":1}]'])('shows corrupt storage without overwriting it on mount: %s', (stored: string): void => {
    localStorage.setItem('task-tracker.tasks.v1', stored)
    const write = vi.spyOn(Storage.prototype, 'setItem')
    render(<StrictMode><TasksPage /></StrictMode>)
    expect(screen.getByRole('alert')).toHaveTextContent(/Existing data has not been changed/)
    expect(write).not.toHaveBeenCalled()
    expect(localStorage.getItem('task-tracker.tasks.v1')).toBe(stored)
  })

  it('warns when storage is unavailable and allows in-memory task actions', async (): Promise<void> => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((): never => {
      throw new DOMException('Denied', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((): never => {
      throw new DOMException('Denied', 'SecurityError')
    })
    const user = userEvent.setup()
    render(<TasksPage />)
    expect(screen.getByRole('alert')).toHaveTextContent(/storage is unavailable/)
    await user.type(screen.getByRole('textbox'), 'Unsaved task')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('checkbox', { name: /Unsaved task/ })).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent(/not saved/)
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Delete Unsaved task' }))
    expect(screen.getByText(/No tasks yet/)).toBeVisible()
  })

  it('shows failed writes, keeps edits in memory, and clears the warning after a successful retry', async (): Promise<void> => {
    const user = userEvent.setup()
    render(<TasksPage />)
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((): never => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    await user.type(screen.getByRole('textbox'), 'Keep working')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('checkbox', { name: /Keep working/ })).not.toBeChecked()
    expect(screen.getByRole('alert')).toHaveTextContent(/Changes are not saved/)
    write.mockRestore()
    await user.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(loadTasks().tasks).toEqual([expect.objectContaining({ title: 'Keep working', completed: true })])
  })
})
