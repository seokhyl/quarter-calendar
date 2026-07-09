import { useState } from 'react'
import QuarterCalendar from './components/QuarterCalendar.jsx'

function App() {
  const [title, setTitle] = useState('Quarter Calendar')
  const [subtitle, setSubtitle] = useState('Summer 2026')

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="editable-heading">
          <input
            className="header-input header-input--title"
            id="app-title"
            aria-label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            className="header-input header-input--subtitle"
            id="quarter-subtitle"
            aria-label="Subtitle"
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
          />
        </div>
        <p className="header-copy">
          Plan from Week 0 through Finals Week, add and revise events, and choose which weeks stay visible.
        </p>
      </header>

      <QuarterCalendar />
    </main>
  )
}

export default App
