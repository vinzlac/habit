import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HabitRow } from './HabitRow'
import type { Habit } from '../lib/types'

const TODAY = new Date()
const todayStr = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`

const baseHabit: Habit = {
  id: '1',
  name: 'Sport',
  completedDates: [],
  createdAt: new Date().toISOString(),
}

const habitDoneToday: Habit = {
  ...baseHabit,
  completedDates: [todayStr],
}

describe('HabitRow', () => {
  it('affiche le nom de l\'habitude', () => {
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={jest.fn()}
        onDelete={jest.fn()}
        onRename={jest.fn()}
      />
    )
    expect(screen.getByText('Sport')).toBeInTheDocument()
  })

  it('affiche un streak de 0 quand aucune date', () => {
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={jest.fn()}
        onDelete={jest.fn()}
        onRename={jest.fn()}
      />
    )
    expect(screen.getByTestId('streak-badge')).toHaveTextContent('0')
  })

  it('affiche le streak correct quand complété aujourd\'hui', () => {
    render(
      <HabitRow
        habit={habitDoneToday}
        onToggleToday={jest.fn()}
        onDelete={jest.fn()}
        onRename={jest.fn()}
      />
    )
    expect(screen.getByTestId('streak-badge')).toHaveTextContent('1')
  })

  it('appelle onToggleToday au clic sur la checkbox', () => {
    const onToggleToday = jest.fn()
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={onToggleToday}
        onDelete={jest.fn()}
        onRename={jest.fn()}
      />
    )
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggleToday).toHaveBeenCalledWith('1')
  })

  it('appelle onDelete au clic sur le bouton supprimer', () => {
    const onDelete = jest.fn()
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={jest.fn()}
        onDelete={onDelete}
        onRename={jest.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('passe en mode édition au double-clic sur le nom', async () => {
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={jest.fn()}
        onDelete={jest.fn()}
        onRename={jest.fn()}
      />
    )
    fireEvent.doubleClick(screen.getByText('Sport'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('appelle onRename avec le nouveau nom à la soumission', async () => {
    const onRename = jest.fn()
    const user = userEvent.setup()
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={jest.fn()}
        onDelete={jest.fn()}
        onRename={onRename}
      />
    )
    fireEvent.doubleClick(screen.getByText('Sport'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Natation')
    await user.keyboard('{Enter}')
    expect(onRename).toHaveBeenCalledWith('1', 'Natation')
  })

  it('n\'appelle pas onRename si le nom est vide', async () => {
    const onRename = jest.fn()
    const user = userEvent.setup()
    render(
      <HabitRow
        habit={baseHabit}
        onToggleToday={jest.fn()}
        onDelete={jest.fn()}
        onRename={onRename}
      />
    )
    fireEvent.doubleClick(screen.getByText('Sport'))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.keyboard('{Enter}')
    expect(onRename).not.toHaveBeenCalled()
  })
})
