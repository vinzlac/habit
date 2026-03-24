export interface Habit {
  id: string
  name: string
  /** Dates locales YYYY-MM-DD des jours où l'habitude a été complétée */
  completedDates: string[]
  createdAt: string
}

export type HabitsState = Habit[]
