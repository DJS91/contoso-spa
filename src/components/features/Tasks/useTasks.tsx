import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { loadTasks, saveTasks, type Task } from '../../../taskStorage'
import type { TasksPresentationProps } from './types'

export function useTasks(): TasksPresentationProps {
  const [initial] = useState(loadTasks)
  const [tasks, setTasks] = useState(initial.tasks)
  const [storageError, setStorageError] = useState(initial.error)
  const [title, setTitle] = useState('')
  const [inputError, setInputError] = useState<string>()
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const deleteButtons = useRef(new Map<string, HTMLButtonElement>())

  function commit(nextTasks: Task[], announcement: string): void {
    setTasks(nextTasks)
    const result = saveTasks(nextTasks)
    setStorageError(result.ok ? undefined : result.error)
    setMessage(announcement)
  }

  function onTitleChange(event: ChangeEvent<HTMLInputElement>): void {
    setTitle(event.target.value)
    setInputError(undefined)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setInputError('Enter a task title.')
      inputRef.current?.focus()
      return
    }
    commit(
      [...tasks, { id: crypto.randomUUID(), title: trimmedTitle, completed: false }],
      `Added "${trimmedTitle}".`,
    )
    setTitle('')
    setInputError(undefined)
    inputRef.current?.focus()
  }

  function onToggle(id: string): void {
    const task = tasks.find((item: Task): boolean => item.id === id)!
    commit(
      tasks.map((item: Task): Task => item.id === id ? { ...item, completed: !item.completed } : item),
      `"${task.title}" marked ${task.completed ? 'incomplete' : 'complete'}.`,
    )
  }

  function onDelete(id: string): void {
    const index = tasks.findIndex((task: Task): boolean => task.id === id)
    const task = tasks[index]
    const focusTask = tasks[index + 1] ?? tasks[index - 1]
    if (focusTask) {
      deleteButtons.current.get(focusTask.id)?.focus()
    } else {
      inputRef.current?.focus()
    }
    commit(tasks.filter((item: Task): boolean => item.id !== id), `Deleted "${task.title}".`)
  }

  function setDeleteButtonRef(id: string, button: HTMLButtonElement | null): void {
    if (button) deleteButtons.current.set(id, button)
    else deleteButtons.current.delete(id)
  }

  return {
    tasks, title, inputError, storageError, message, inputRef,
    setDeleteButtonRef, onTitleChange, onSubmit, onToggle, onDelete,
  }
}
