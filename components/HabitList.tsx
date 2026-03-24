'use client'

import type { Habit } from '../lib/types'
import { HabitRow } from './HabitRow'

interface Props {
  habits: Habit[]
  onToggleToday: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
}

export function HabitList({ habits, onToggleToday, onDelete, onRename }: Props) {
  if (habits.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-10">
        Aucune habitude pour l&apos;instant. Ajoutez-en une ci-dessus !
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          onToggleToday={onToggleToday}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </ul>
  )
}
