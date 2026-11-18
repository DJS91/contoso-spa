import type { ReactElement } from 'react'

export default function AboutPage(): ReactElement {
  return (
    <article className="about">
      <title>About | Task Tracker</title>
      <h1>About Task Tracker</h1>
      <p>A little space to keep track of what matters next.</p>
      <p>Add tasks, check them off, and delete them when you no longer need them.</p>
      <h2>Your tasks stay here</h2>
      <p>
        Tasks are saved in localStorage in this browser, on this device. There is
        no account, server, or sync across devices. Clearing browser data removes
        your tasks, and private browsing may remove them when the session ends.
      </p>
      <p>
        If storage is unavailable or full, you can keep working in memory, but
        unsaved changes will be lost when you leave the Tasks page or reload.
        Avoid storing sensitive information on a shared device.
      </p>
    </article>
  )
}
