/**
 * Retourne la date locale du navigateur au format YYYY-MM-DD.
 *
 * On utilise les composantes locales (getFullYear, getMonth, getDate) et non
 * toISOString() qui retourne l'heure UTC — un utilisateur à UTC+2 à 23h30
 * serait sinon attribué au lendemain en UTC.
 */
export function getTodayLocalDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Calcule le streak courant (jours consécutifs complétés) à partir
 * d'un tableau de dates YYYY-MM-DD.
 *
 * Algorithme :
 * 1. Dédoublonner et trier les dates du plus récent au plus ancien.
 * 2. Si la date la plus récente n'est ni aujourd'hui ni hier → streak 0
 *    (la chaîne est rompue, un jour a été manqué).
 * 3. Remonter la liste en vérifiant que chaque date précède la suivante
 *    d'exactement 1 jour calendaire. Arrêter au premier trou.
 *
 * @param completedDates - Tableau de dates locales YYYY-MM-DD (peut contenir des doublons)
 * @returns Nombre entier ≥ 0
 */
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  // Dédoublonner et trier par ordre décroissant
  const unique = [...new Set(completedDates)].sort().reverse()

  const today = getTodayLocalDate()
  const yesterday = offsetDate(today, -1)

  // Si la date la plus récente n'est ni aujourd'hui ni hier, la chaîne est rompue
  const latest = unique[0]
  if (latest !== today && latest !== yesterday) return 0

  // Compter les jours consécutifs en remontant depuis la date la plus récente
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const expected = offsetDate(unique[i - 1], -1)
    if (unique[i] === expected) {
      streak++
    } else {
      // Trou détecté : la série s'arrête ici
      break
    }
  }

  return streak
}

/**
 * Retourne true si aujourd'hui figure dans le tableau de dates.
 */
export function isCompletedToday(completedDates: string[]): boolean {
  return completedDates.includes(getTodayLocalDate())
}

// ─── Utilitaire interne ───────────────────────────────────────────────────────

/**
 * Décale une date YYYY-MM-DD de `days` jours (négatif = dans le passé).
 * Utilise Date pour gérer correctement les fins de mois.
 */
function offsetDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
