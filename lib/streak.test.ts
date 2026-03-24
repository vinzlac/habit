import { calculateStreak, getTodayLocalDate } from './streak'

// Helper : retourne une date locale décalée de N jours par rapport à aujourd'hui
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

describe('getTodayLocalDate', () => {
  it('retourne une chaîne au format YYYY-MM-DD', () => {
    expect(getTodayLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('calculateStreak', () => {
  it('retourne 0 pour un tableau vide', () => {
    expect(calculateStreak([])).toBe(0)
  })

  it('retourne 1 si seul aujourd\'hui est complété', () => {
    expect(calculateStreak([daysAgo(0)])).toBe(1)
  })

  it('retourne 1 si seul hier est complété (pas aujourd\'hui)', () => {
    // Hier seul : la chaîne est de 1 (hier = dernier jour consécutif)
    expect(calculateStreak([daysAgo(1)])).toBe(1)
  })

  it('retourne 2 si aujourd\'hui et hier sont complétés', () => {
    expect(calculateStreak([daysAgo(0), daysAgo(1)])).toBe(2)
  })

  it('retourne 3 pour trois jours consécutifs finissant aujourd\'hui', () => {
    expect(calculateStreak([daysAgo(0), daysAgo(1), daysAgo(2)])).toBe(3)
  })

  it('retourne 1 si aujourd\'hui est complété mais pas hier (trou)', () => {
    // aujourd'hui + avant-hier : trou hier → streak = 1
    expect(calculateStreak([daysAgo(0), daysAgo(2)])).toBe(1)
  })

  it('retourne 0 si la dernière complétion date de plus d\'hier', () => {
    // Avant-hier et plus ancien : chaîne rompue depuis hier
    expect(calculateStreak([daysAgo(2), daysAgo(3)])).toBe(0)
  })

  it('ignore les dates dupliquées', () => {
    const today = daysAgo(0)
    const yesterday = daysAgo(1)
    expect(calculateStreak([today, today, yesterday, yesterday])).toBe(2)
  })

  it('gère une longue série consécutive', () => {
    const dates = Array.from({ length: 7 }, (_, i) => daysAgo(i))
    expect(calculateStreak(dates)).toBe(7)
  })

  it('coupe la série au premier trou', () => {
    // Jours 0, 1, 2 présents, jour 3 manquant, jours 4 et 5 présents
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(4), daysAgo(5)]
    expect(calculateStreak(dates)).toBe(3)
  })
})
