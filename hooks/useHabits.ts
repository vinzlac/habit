'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Habit, HabitsState } from '../lib/types'
import { loadHabits, saveHabits } from '../lib/storage'
import { getTodayLocalDate } from '../lib/streak'

export function useHabits() {
  const [habits, setHabits] = useState<HabitsState>([])

  // Charger depuis localStorage au montage
  useEffect(() => {
    setHabits(loadHabits())
  }, [])

  // Recalculer le streak quand l'onglet redevient visible (minuit passé, par exemple)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Les streaks sont dérivés à l'affichage — forcer un re-render suffit
        setHabits((prev) => [...prev])
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  /** Applique une mutation immutable et persiste */
  const withSave = useCallback((updater: (prev: HabitsState) => HabitsState) => {
    setHabits((prev) => {
      const next = updater(prev)
      saveHabits(next)
      return next
    })
  }, [])

  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const newHabit: Habit = {
      id: generateId(),
      name: trimmed,
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
    withSave((prev) => [...prev, newHabit])
  }, [withSave])

  const deleteHabit = useCallback((id: string) => {
    withSave((prev) => prev.filter((h) => h.id !== id))
  }, [withSave])

  const renameHabit = useCallback((id: string, newName: string) => {
    const trimmed = newName.trim()
    if (!trimmed) return
    withSave((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h))
    )
  }, [withSave])

  const toggleToday = useCallback((id: string) => {
    const today = getTodayLocalDate()
    withSave((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const already = h.completedDates.includes(today)
        return {
          ...h,
          completedDates: already
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        }
      })
    )
  }, [withSave])

  return { habits, addHabit, deleteHabit, renameHabit, toggleToday }
}

// ─── Utilitaire interne ───────────────────────────────────────────────────────

/**
 * Génère un identifiant unique.
 * crypto.randomUUID() est disponible dans les navigateurs modernes et Node 18+.
 * Appelé uniquement côté client (dans une callback), jamais au niveau module.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback pour environnements sans crypto.randomUUID (ex. jsdom < 19)
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
