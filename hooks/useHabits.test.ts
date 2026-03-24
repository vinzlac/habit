import { renderHook, act } from '@testing-library/react'
import { useHabits } from './useHabits'
import { clearHabits, loadHabits } from '../lib/storage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  clearHabits()
})

describe('useHabits — initialisation', () => {
  it('démarre avec une liste vide si localStorage est vide', () => {
    const { result } = renderHook(() => useHabits())
    expect(result.current.habits).toEqual([])
  })

  it('hydrate depuis localStorage au montage', () => {
    const saved = [
      { id: '1', name: 'Méditation', completedDates: [], createdAt: new Date().toISOString() },
    ]
    localStorage.setItem('habit-tracker:habits', JSON.stringify(saved))
    const { result } = renderHook(() => useHabits())
    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe('Méditation')
  })
})

describe('useHabits — addHabit', () => {
  it('ajoute une habitude avec un id unique et des completedDates vides', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe('Sport')
    expect(result.current.habits[0].completedDates).toEqual([])
    expect(result.current.habits[0].id).toBeTruthy()
  })

  it('persiste dans localStorage', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Lecture'))
    expect(loadHabits()).toHaveLength(1)
  })

  it('génère des ids différents pour deux habitudes', () => {
    const { result } = renderHook(() => useHabits())
    act(() => {
      result.current.addHabit('A')
      result.current.addHabit('B')
    })
    const [h1, h2] = result.current.habits
    expect(h1.id).not.toBe(h2.id)
  })
})

describe('useHabits — deleteHabit', () => {
  it('supprime l\'habitude par id', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const id = result.current.habits[0].id
    act(() => result.current.deleteHabit(id))
    expect(result.current.habits).toHaveLength(0)
  })

  it('ne supprime pas les autres habitudes', () => {
    const { result } = renderHook(() => useHabits())
    act(() => {
      result.current.addHabit('A')
      result.current.addHabit('B')
    })
    const idA = result.current.habits[0].id
    act(() => result.current.deleteHabit(idA))
    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe('B')
  })
})

describe('useHabits — renameHabit', () => {
  it('modifie le nom de l\'habitude', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const id = result.current.habits[0].id
    act(() => result.current.renameHabit(id, 'Natation'))
    expect(result.current.habits[0].name).toBe('Natation')
  })

  it('ne mute pas l\'objet original (immutabilité)', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const before = result.current.habits[0]
    const id = before.id
    act(() => result.current.renameHabit(id, 'Natation'))
    // L'objet original doit être inchangé
    expect(before.name).toBe('Sport')
  })
})

describe('useHabits — toggleToday', () => {
  it('ajoute la date du jour à completedDates', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const id = result.current.habits[0].id
    act(() => result.current.toggleToday(id))
    expect(result.current.habits[0].completedDates).toHaveLength(1)
  })

  it('retire la date du jour si déjà présente (toggle off)', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const id = result.current.habits[0].id
    act(() => result.current.toggleToday(id))
    act(() => result.current.toggleToday(id))
    expect(result.current.habits[0].completedDates).toHaveLength(0)
  })
})

describe('useHabits — visibilitychange', () => {
  it('force un re-render quand l\'onglet devient visible', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const habitsBefore = result.current.habits

    // Simuler visibilitychange avec state = 'visible'
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    // Le tableau doit être un nouveau référence (re-render déclenché)
    expect(result.current.habits).not.toBe(habitsBefore)
    expect(result.current.habits).toHaveLength(1)
  })

  it('ne re-render pas si l\'onglet devient caché', () => {
    const { result } = renderHook(() => useHabits())
    act(() => result.current.addHabit('Sport'))
    const habitsBefore = result.current.habits

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current.habits).toBe(habitsBefore)
  })
})
