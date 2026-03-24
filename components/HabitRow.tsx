'use client'

import { useState, useRef, useEffect } from 'react'
import type { Habit } from '../lib/types'
import { calculateStreak, isCompletedToday } from '../lib/streak'

interface Props {
  habit: Habit
  onToggleToday: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
}

export function HabitRow({ habit, onToggleToday, onDelete, onRename }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(habit.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const streak = calculateStreak(habit.completedDates)
  const doneToday = isCompletedToday(habit.completedDates)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  function handleRenameSubmit() {
    const trimmed = editValue.trim()
    if (trimmed) {
      onRename(habit.id, trimmed)
    }
    setIsEditing(false)
    setEditValue(habit.name)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleRenameSubmit()
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(habit.name)
    }
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={doneToday}
        onChange={() => onToggleToday(habit.id)}
        className="w-5 h-5 rounded-md accent-emerald-500 cursor-pointer transition-transform duration-150 active:scale-90"
        aria-label={`Marquer ${habit.name} comme fait aujourd'hui`}
      />

      {/* Nom / champ d'édition */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-b border-emerald-400 outline-none text-sm dark:text-white"
          />
        ) : (
          <span
            onDoubleClick={() => { setIsEditing(true); setEditValue(habit.name) }}
            className={`block truncate text-sm cursor-text select-none transition-opacity duration-200 ${
              doneToday ? 'line-through opacity-50' : 'opacity-100'
            } dark:text-white`}
            title="Double-cliquer pour renommer"
          >
            {habit.name}
          </span>
        )}
      </div>

      {/* Streak badge */}
      <span
        data-testid="streak-badge"
        className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full transition-colors duration-200 ${
          streak > 0
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
        }`}
        title={`${streak} jour${streak !== 1 ? 's' : ''} consécutif${streak !== 1 ? 's' : ''}`}
      >
        {streak > 0 ? `🔥 ${streak}` : streak}
      </span>

      {/* Bouton supprimer */}
      <button
        onClick={() => onDelete(habit.id)}
        aria-label="Supprimer"
        className="flex-shrink-0 text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-colors duration-150 text-lg leading-none"
      >
        ×
      </button>
    </li>
  )
}
