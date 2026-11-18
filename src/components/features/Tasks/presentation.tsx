import type { ReactElement } from 'react'
import type { Task } from '../../../taskStorage'
import type { TasksPresentationProps } from './types'
import styles from './presentation.module.scss'

export function TasksPresentation({
  tasks, title, inputError, storageError, message, inputRef,
  setDeleteButtonRef, onTitleChange, onSubmit, onToggle, onDelete,
}: TasksPresentationProps): ReactElement {
  return (
    <section className={styles.tasks} aria-labelledby="tasks-heading">
      <div>
        <h1 id="tasks-heading">Your tasks</h1>
        <p>Make room for what comes next.</p>
      </div>
      {storageError && <p className={styles.error} role="alert">{storageError}</p>}
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <label htmlFor="task-title">New task</label>
        <div className={styles.entry}>
          <input
            ref={inputRef}
            id="task-title"
            name="title"
            type="text"
            value={title}
            onChange={onTitleChange}
            aria-invalid={Boolean(inputError)}
            aria-describedby={inputError ? 'task-title-error' : undefined}
            placeholder="What needs doing?"
            required
          />
          <button type="submit">Add task</button>
        </div>
        {inputError && <p id="task-title-error" className={styles.error} role="alert">{inputError}</p>}
      </form>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{message}</p>
      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <h2>A fresh start</h2>
          <p>No tasks yet. Add your first task above.</p>
        </div>
      ) : (
        <ul className={styles.list} aria-label="Tasks">
          {tasks.map((task: Task): ReactElement => (
            <li className={styles.task} key={task.id}>
              <label className={styles.taskLabel}>
                <input type="checkbox" checked={task.completed} onChange={(): void => onToggle(task.id)} />
                <span className={task.completed ? styles.completed : undefined}>{task.title}</span>{' '}
                <span className={styles.badge}>{task.completed ? 'Complete' : 'To do'}</span>
              </label>
              <button
                type="button"
                className={styles.delete}
                ref={(button): void => setDeleteButtonRef?.(task.id, button)}
                aria-label={`Delete ${task.title}`}
                onClick={(): void => onDelete(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
