import { loadHabits, saveHabits, clearHabits } from './storage'
import type { Habit } from './types'

const SAMPLE: Habit[] = [
  { id: '1', name: 'Sport', completedDates: ['2024-01-01'], createdAt: '2024-01-01T00:00:00.000Z' },
]

beforeEach(() => {
  localStorage.clear()
})

describe('loadHabits', () => {
  it('retourne [] quand localStorage est vide', () => {
    expect(loadHabits()).toEqual([])
  })

  it('retourne les habitudes sauvegardées', () => {
    localStorage.setItem('habit-tracker:habits', JSON.stringify(SAMPLE))
    expect(loadHabits()).toEqual(SAMPLE)
  })

  it('retourne [] pour du JSON invalide (pas de crash)', () => {
    localStorage.setItem('habit-tracker:habits', '{invalid json}')
    expect(loadHabits()).toEqual([])
  })

  it('retourne [] si la valeur JSON n\'est pas un tableau', () => {
    localStorage.setItem('habit-tracker:habits', JSON.stringify({ foo: 'bar' }))
    expect(loadHabits()).toEqual([])
  })

  it('retourne [] si la valeur JSON est null', () => {
    localStorage.setItem('habit-tracker:habits', 'null')
    expect(loadHabits()).toEqual([])
  })
})

describe('saveHabits', () => {
  it('persiste les habitudes et loadHabits les retrouve', () => {
    saveHabits(SAMPLE)
    expect(loadHabits()).toEqual(SAMPLE)
  })

  it('écrase les données précédentes', () => {
    saveHabits(SAMPLE)
    saveHabits([])
    expect(loadHabits()).toEqual([])
  })
})

describe('clearHabits', () => {
  it('vide le localStorage', () => {
    saveHabits(SAMPLE)
    clearHabits()
    expect(loadHabits()).toEqual([])
  })
})

describe('saveHabits — catch block', () => {
  it('ne plante pas si localStorage.setItem lève une erreur (quota)', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveHabits(SAMPLE)).not.toThrow()
    spy.mockRestore()
  })
})
