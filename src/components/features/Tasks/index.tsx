import type { ReactElement } from 'react'
import { TasksPresentation } from './presentation'
import { useTasks } from './useTasks'

export default function Tasks(): ReactElement {
  const props = useTasks()
  return <TasksPresentation {...props} />
}
