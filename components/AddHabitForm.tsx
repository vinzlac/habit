'use client'

import { useState } from 'react'

interface Props {
  onAdd: (name: string) => void
}

export function AddHabitForm({ onAdd }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="new-habit" className="sr-only">
        Nom de la nouvelle habitude
      </label>
      <input
        id="new-habit"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nouvelle habitude…"
        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
      >
        Ajouter
      </button>
    </form>
  )
}
