import { render, screen } from '@testing-library/react'
import { HabitList } from './HabitList'
import type { Habit } from '../lib/types'

const habits: Habit[] = [
  { id: '1', name: 'Sport', completedDates: [], createdAt: new Date().toISOString() },
  { id: '2', name: 'Lecture', completedDates: [], createdAt: new Date().toISOString() },
]

describe('HabitList', () => {
  it('affiche un message quand la liste est vide', () => {
    render(<HabitList habits={[]} onToggleToday={jest.fn()} onDelete={jest.fn()} onRename={jest.fn()} />)
    expect(screen.getByText(/aucune habitude/i)).toBeInTheDocument()
  })

  it('affiche toutes les habitudes', () => {
    render(<HabitList habits={habits} onToggleToday={jest.fn()} onDelete={jest.fn()} onRename={jest.fn()} />)
    expect(screen.getByText('Sport')).toBeInTheDocument()
    expect(screen.getByText('Lecture')).toBeInTheDocument()
  })
})
