import type { ChangeEventHandler, FormEventHandler, RefObject } from 'react'
import type { Task } from '../../../taskStorage'

export type TasksPresentationProps = {
  tasks: Task[]
  title: string
  inputError?: string
  storageError?: string
  message: string
  inputRef?: RefObject<HTMLInputElement | null>
  setDeleteButtonRef?: (id: string, button: HTMLButtonElement | null) => void
  onTitleChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}
