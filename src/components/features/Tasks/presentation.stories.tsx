import { TasksPresentation } from './presentation'
import type { TasksPresentationProps } from './types'

// CSF stories are ready for a Storybook host; the app does not require Storybook.
const args: TasksPresentationProps = {
  tasks: [
    { id: 'first', title: 'Plan the day', completed: false },
    { id: 'second', title: 'Take a break', completed: true },
  ],
  title: '',
  message: '',
  onTitleChange: (): void => {},
  onSubmit: (event): void => event.preventDefault(),
  onToggle: (): void => {},
  onDelete: (): void => {},
}

export default {
  title: 'Features/Tasks',
  component: TasksPresentation,
  args,
}

export const Default = {}
export const Empty = { args: { tasks: [] } }
export const Error = { args: { inputError: 'Enter a task title.' } }
export const StorageError = { args: { storageError: 'Changes are not saved. Browser storage is unavailable.' } }
