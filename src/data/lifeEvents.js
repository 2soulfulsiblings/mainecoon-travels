export const DATE_CATEGORIES = {
  birthday:    { label: 'Birthday',    icon: '🎂', color: 'bg-tmc-teal-light text-tmc-teal-dark border-tmc-teal/20' },
  anniversary: { label: 'Anniversary', icon: '💍', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  other:       { label: 'Other Date',  icon: '📌', color: 'bg-gray-100 text-gray-700 border-gray-200' },
}

export const PLAN_TYPES = {
  concert: { label: 'Concert', icon: '🎤', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  trip:    { label: 'Trip',    icon: '🧳', color: 'bg-tmc-amber-light text-amber-800 border-amber-200' },
  plan:    { label: 'Plan',    icon: '📍', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  other:   { label: 'Other',  icon: '✨', color: 'bg-gray-100 text-gray-700 border-gray-200' },
}

export function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function nextBirthdayDate(month, day, from = startOfToday()) {
  const year = from.getFullYear()
  let d = new Date(year, month - 1, day)
  d.setHours(0, 0, 0, 0)
  if (d < from) d = new Date(year + 1, month - 1, day)
  return d
}

export function daysUntil(date, from = startOfToday()) {
  return Math.round((date.getTime() - from.getTime()) / 86400000)
}

export function formatDaysAway(n) {
  if (n === 0) return 'Today!'
  if (n === 1) return 'Tomorrow'
  if (n < 0) return 'Past'
  return `In ${n} days`
}

export function calcAge(birthYear, targetYear) {
  if (!birthYear) return null
  return targetYear - birthYear
}
