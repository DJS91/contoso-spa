import type { ReactElement } from 'react'
import Tasks from '../components/features/Tasks'

export default function TasksPage(): ReactElement {
  return (
    <>
      <title>Tasks | Task Tracker</title>
      <Tasks />
    </>
  )
}
