import type { Habit } from './types'

/**
 * Clé localStorage stable. Ne jamais la modifier : les données existantes
 * des utilisateurs seraient perdues au prochain chargement.
 */
const STORAGE_KEY = 'habit-tracker:habits'

/**
 * Lit les habitudes depuis localStorage.
 *
 * Stratégie de lecture :
 * - Appelé au montage du composant racine (useEffect) et sur visibilitychange.
 * - En cas d'erreur (JSON invalide, valeur null, type inattendu) on retourne []
 *   sans crasher — l'application repart d'un état vide.
 * - Guard `typeof window` : Next.js effectue un pré-rendu statique en Node.js
 *   où window est undefined.
 */
export function loadHabits(): Habit[] {
  /* istanbul ignore next — guard SSR (Node.js, non testable en jsdom) */
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed as Habit[]
  } catch {
    return []
  }
}

/**
 * Persiste les habitudes dans localStorage.
 *
 * Stratégie d'écriture :
 * - Appelé après chaque mutation de l'état (add, delete, rename, toggleToday).
 * - On sérialise l'intégralité du tableau à chaque fois (données légères).
 * - Les erreurs sont loguées mais ne propagent pas d'exception pour éviter de
 *   bloquer l'UI.
 */
export function saveHabits(habits: Habit[]): void {
  /* istanbul ignore next — guard SSR */
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch (err) {
    console.error('[habit-tracker] Impossible de sauvegarder dans localStorage:', err)
  }
}

/**
 * Supprime la clé du localStorage (utile pour les tests et le debug).
 */
export function clearHabits(): void {
  /* istanbul ignore next — guard SSR */
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
