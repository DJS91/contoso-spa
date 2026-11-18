export type Task = { id: string; title: string; completed: boolean }

export type LoadResult = { tasks: Task[]; error?: string }
export type SaveResult = { ok: true } | { ok: false; error: string }

const storageKey = 'task-tracker.tasks.v1'

function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value && typeof value.id === 'string' && value.id.trim().length > 0 &&
    'title' in value && typeof value.title === 'string' && value.title.trim().length > 0 &&
    'completed' in value && typeof value.completed === 'boolean'
  )
}

export function loadTasks(): LoadResult {
  let stored: string | null
  try {
    stored = window.localStorage.getItem(storageKey)
  } catch {
    return {
      tasks: [],
      error: 'Browser storage is unavailable. Changes are not saved and will be lost when you leave this page or reload.',
    }
  }
  if (stored === null) return { tasks: [] }

  let parsed: unknown
  try {
    parsed = JSON.parse(stored)
  } catch {
    return { tasks: [], error: 'Saved tasks contain malformed JSON. Existing data has not been changed. Adding a task will replace it.' }
  }

  if (
    !Array.isArray(parsed) || !parsed.every(isTask) ||
    new Set(parsed.map((task: Task): string => task.id)).size !== parsed.length
  ) {
    return { tasks: [], error: 'Saved tasks have an invalid format. Existing data has not been changed. Adding a task will replace it.' }
  }
  return { tasks: parsed }
}

export function saveTasks(tasks: Task[]): SaveResult {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(tasks))
    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'Tasks could not be saved to browser storage. Changes are not saved and will be lost when you leave this page or reload.',
    }
  }
}
