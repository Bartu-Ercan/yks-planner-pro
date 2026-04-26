export interface Task {
  id: string
  user_id: string
  day: string // Monday, Tuesday, etc.
  subject: string // AYT Matematik, TYT Genel, etc.
  title: string
  is_routine: boolean
  completed: boolean
  color: string
  created_at: string
}

export interface Routine {
  id: string
  user_id: string
  day: string
  subject: string
  title: string
  color: string
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export const DAYS_TR: Record<DayOfWeek, string> = {
  Monday: 'Pazartesi',
  Tuesday: 'Salı',
  Wednesday: 'Çarşamba',
  Thursday: 'Perşembe',
  Friday: 'Cuma',
  Saturday: 'Cumartesi',
  Sunday: 'Pazar',
}

export const DAYS_SHORT: Record<DayOfWeek, string> = {
  Monday: 'Pzt',
  Tuesday: 'Salı',
  Wednesday: 'Çrş',
  Thursday: 'Prş',
  Friday: 'Cuma',
  Saturday: 'Cmt',
  Sunday: 'Paz',
}

export const SUBJECT_COLORS: Record<string, string> = {
  'AYT Matematik': 'bg-red-500/20 text-red-400 border-red-500/30',
  'TYT Genel': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'TYT Türkçe': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'TYT Fen': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'TYT Sosyal': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'TYT Matematik': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'AYT Fizik': 'bg-orange-600/20 text-orange-500 border-orange-600/30',
  'AYT Kimya': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'AYT Biyoloji': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Geometri': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Rutin': 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  'Dinamik': 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
}
