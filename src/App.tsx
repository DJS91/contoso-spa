import { useEffect, useRef, type ReactElement } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import AboutPage from './pages/AboutPage'

export default function App(): ReactElement {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const mainRef = useRef<HTMLElement>(null)

  useEffect((): void => {
    if (previousPath.current !== pathname) {
      mainRef.current?.focus()
      previousPath.current = pathname
    }
  }, [pathname])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <span className="brand">Task Tracker</span>
        <nav aria-label="Main">
          <NavLink to="/" end>Tasks</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <footer>Small steps, one task at a time. Stored only in this browser.</footer>
    </div>
  )
}
