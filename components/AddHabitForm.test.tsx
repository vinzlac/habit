import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddHabitForm } from './AddHabitForm'

describe('AddHabitForm', () => {
  it('affiche l\'input et le bouton Ajouter', () => {
    render(<AddHabitForm onAdd={jest.fn()} />)
    expect(screen.getByPlaceholderText(/nouvelle habitude/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument()
  })

  it('le bouton est désactivé quand l\'input est vide', () => {
    render(<AddHabitForm onAdd={jest.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('appelle onAdd avec le nom saisi à la soumission', async () => {
    const onAdd = jest.fn()
    const user = userEvent.setup()
    render(<AddHabitForm onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText(/nouvelle habitude/i), 'Méditation')
    await user.click(screen.getByRole('button'))
    expect(onAdd).toHaveBeenCalledWith('Méditation')
  })

  it('vide l\'input après soumission', async () => {
    const user = userEvent.setup()
    render(<AddHabitForm onAdd={jest.fn()} />)
    const input = screen.getByPlaceholderText(/nouvelle habitude/i)
    await user.type(input, 'Yoga')
    await user.click(screen.getByRole('button'))
    expect(input).toHaveValue('')
  })

  it('ne soumet pas si le champ ne contient que des espaces', async () => {
    const onAdd = jest.fn()
    const user = userEvent.setup()
    render(<AddHabitForm onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText(/nouvelle habitude/i), '   ')
    fireEvent.submit(screen.getByRole('button').closest('form')!)
    expect(onAdd).not.toHaveBeenCalled()
  })
})
