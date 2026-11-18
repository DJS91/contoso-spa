import { describe, expect, it, vi } from 'vitest'
import { loadTasks, saveTasks, type Task } from './taskStorage'

const key = 'task-tracker.tasks.v1'
const tasks: Task[] = [{ id: 'one', title: 'Read a book', completed: false }]

describe('task storage', (): void => {
  it('starts empty when nothing has been saved', (): void => {
    expect(loadTasks()).toEqual({ tasks: [] })
  })

  it('round-trips tasks and replaces previously saved data', (): void => {
    expect(saveTasks(tasks)).toEqual({ ok: true })
    expect(loadTasks()).toEqual({ tasks })
    expect(saveTasks([])).toEqual({ ok: true })
    expect(loadTasks()).toEqual({ tasks: [] })
  })

  it('reports malformed JSON without modifying it', (): void => {
    localStorage.setItem(key, '{broken')
    expect(loadTasks()).toMatchObject({ tasks: [], error: expect.stringMatching(/malformed JSON/) })
    expect(localStorage.getItem(key)).toBe('{broken')
  })

  it.each([
    null,
    {},
    [null],
    [{ id: 'one', title: 'Read' }],
    [{ id: 'one', title: 'Read', completed: 'false' }],
    [{ id: '', title: 'Read', completed: false }],
    [{ id: 'one', title: '   ', completed: false }],
    [...tasks, ...tasks],
  ])('reports an invalid task format: %j', (value: unknown): void => {
    const stored = JSON.stringify(value)
    localStorage.setItem(key, stored)
    expect(loadTasks()).toMatchObject({ tasks: [], error: expect.stringMatching(/invalid format/) })
    expect(localStorage.getItem(key)).toBe(stored)
  })

  it('reports unavailable storage access', (): void => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation((): never => {
      throw new DOMException('Denied', 'SecurityError')
    })
    expect(loadTasks()).toMatchObject({ tasks: [], error: expect.stringMatching(/storage is unavailable/) })
    expect(saveTasks(tasks)).toMatchObject({ ok: false, error: expect.stringMatching(/not saved/) })
  })

  it('reports read failures', (): void => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((): never => {
      throw new DOMException('Denied', 'SecurityError')
    })
    expect(loadTasks()).toMatchObject({ tasks: [], error: expect.stringMatching(/storage is unavailable/) })
  })

  it('reports failed writes and preserves previously saved tasks', (): void => {
    saveTasks(tasks)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((): never => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    expect(saveTasks([])).toMatchObject({ ok: false, error: expect.stringMatching(/not saved/) })
    expect(loadTasks()).toEqual({ tasks })
  })
})
