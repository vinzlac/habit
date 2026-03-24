'use client'

import { useEffect, useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { AddHabitForm } from '../components/AddHabitForm'
import { HabitList } from '../components/HabitList'

const THEME_KEY = 'habit-tracker:theme'

export default function Home() {
  const { habits, addHabit, deleteHabit, renameHabit, toggleToday } = useHabits()
  const [dark, setDark] = useState(false)

  // Initialiser le thème depuis localStorage ou prefers-color-scheme
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored !== null) {
      setDark(stored === 'dark')
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  // Appliquer la classe dark sur <html> et persister le choix
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem(THEME_KEY, 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem(THEME_KEY, 'light')
    }
  }, [dark])

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      {/* En-tête */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">
            Habit Tracker
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
            {today}
          </p>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-150 text-lg"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Formulaire d'ajout */}
      <div className="mb-6">
        <AddHabitForm onAdd={addHabit} />
      </div>

      {/* Liste */}
      <HabitList
        habits={habits}
        onToggleToday={toggleToday}
        onDelete={deleteHabit}
        onRename={renameHabit}
      />
    </main>
  )
}
