import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('app routing', (): void => {
  it('navigates between routes, updates active state and title, and focuses the main content', async (): Promise<void> => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Your tasks', level: 1 })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Tasks' })).toHaveAttribute('aria-current', 'page')
    expect(document.title).toBe('Tasks | Task Tracker')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus()
    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'About Task Tracker', level: 1 })).toBeVisible()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Tasks' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('main')).toHaveFocus()
    expect(document.title).toBe('About | Task Tracker')
    await user.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(screen.getByRole('heading', { name: 'Your tasks' })).toBeVisible()
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('renders /about directly', (): void => {
    render(<MemoryRouter initialEntries={['/about']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'About Task Tracker' })).toBeVisible()
    expect(screen.getByText(/There is no account, server, or sync/)).toBeVisible()
  })

  it('restores saved tasks after navigating away and back', async (): Promise<void> => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    await user.type(screen.getByRole('textbox'), 'Return to this')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    await user.click(screen.getByRole('link', { name: 'About' }))
    await user.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(screen.getByRole('checkbox', { name: /Return to this/ })).toBeVisible()
  })
})
