import { useState } from 'react'
import {
  DATE_CATEGORIES, PLAN_TYPES,
  nextBirthdayDate, daysUntil, formatDaysAway, calcAge, startOfToday,
} from '../data/lifeEvents.js'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function urgencyClasses(days) {
  if (days <= 3) return 'bg-red-50 text-red-700 border-red-200'
  if (days <= 14) return 'bg-tmc-amber-light text-amber-800 border-amber-200'
  return 'bg-gray-50 text-gray-600 border-gray-200'
}

function BirthdayModal({ item, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    name: '', category: 'birthday', month: 1, day: 1, year: '', notes: '', ...item,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-tmc-navy">{item.id ? 'Edit Date' : 'Add a Date'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal"
              placeholder="Whose date is this?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
              {Object.entries(DATE_CATEGORIES).map(([id, c]) => (
                <option key={id} value={id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select value={form.month} onChange={e => set('month', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input type="number" min="1" max="31" value={form.day} onChange={e => set('day', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" value={form.year} onChange={e => set('year', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30"
                placeholder="1990" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 resize-none"
              placeholder="Gift ideas, reminders..." />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div>
            {item.id && (
              <button onClick={() => onDelete(item.id)} className="text-sm text-red-400 hover:text-red-600 transition">Delete</button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            <button
              onClick={() => { if (form.name && form.day) onSave({ ...form, year: form.year ? Number(form.year) : null }) }}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-tmc-teal text-white hover:bg-tmc-teal-dark transition"
            >
              {item.id ? 'Save' : 'Add Date'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanModal({ item, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({ type: 'plan', title: '', date: '', notes: '', ...item })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-tmc-navy">{item.id ? 'Edit Plan' : 'Add a Plan'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
              {Object.entries(PLAN_TYPES).map(([id, t]) => (
                <option key={id} value={id}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal"
              placeholder="What's the plan?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 resize-none"
              placeholder="Venue, who's coming, ticket link..." />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div>
            {item.id && (
              <button onClick={() => onDelete(item.id)} className="text-sm text-red-400 hover:text-red-600 transition">Delete</button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            <button
              onClick={() => { if (form.title && form.date) onSave(form) }}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-tmc-teal text-white hover:bg-tmc-teal-dark transition"
            >
              {item.id ? 'Save' : 'Add Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Life({ birthdays, setBirthdays, plans, setPlans }) {
  const today = startOfToday()
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)

  const openNewBirthday = () => {
    setEditing({ name: '', category: 'birthday', month: today.getMonth() + 1, day: today.getDate(), year: '', notes: '' })
    setModal('birthday')
  }
  const openEditBirthday = (b) => { setEditing({ ...b }); setModal('birthday') }
  const openNewPlan = () => { setEditing({ type: 'plan', title: '', date: '', notes: '' }); setModal('plan') }
  const openEditPlan = (p) => { setEditing({ ...p }); setModal('plan') }

  const saveBirthday = (form) => {
    if (form.id) setBirthdays(prev => prev.map(b => b.id === form.id ? { ...form } : b))
    else setBirthdays(prev => [...prev, { ...form, id: `bd-${Date.now()}` }])
    setModal(null)
  }
  const deleteBirthday = (id) => { setBirthdays(prev => prev.filter(b => b.id !== id)); setModal(null) }

  const savePlan = (form) => {
    if (form.id) setPlans(prev => prev.map(p => p.id === form.id ? { ...form } : p))
    else setPlans(prev => [...prev, { ...form, id: `pl-${Date.now()}` }])
    setModal(null)
  }
  const deletePlan = (id) => { setPlans(prev => prev.filter(p => p.id !== id)); setModal(null) }

  const sortedBirthdays = [...birthdays]
    .map(b => {
      const next = nextBirthdayDate(b.month, b.day, today)
      return { ...b, next, days: daysUntil(next, today) }
    })
    .sort((a, b) => a.days - b.days)

  const upcomingPlans = [...plans]
    .filter(p => new Date(p.date + 'T12:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date))

  const pastPlans = [...plans]
    .filter(p => new Date(p.date + 'T12:00:00') < today)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {modal === 'birthday' && editing && (
        <BirthdayModal item={editing} onSave={saveBirthday} onDelete={deleteBirthday} onClose={() => setModal(null)} />
      )}
      {modal === 'plan' && editing && (
        <PlanModal item={editing} onSave={savePlan} onDelete={deletePlan} onClose={() => setModal(null)} />
      )}

      <div>
        <h2 className="text-2xl font-bold text-tmc-navy">Life 🎉</h2>
        <p className="text-sm text-gray-500 mt-0.5">Birthdays, important dates, plans, and concerts — so nothing slips through.</p>
      </div>

      {/* Birthdays & Important Dates */}
      <div className="bg-white rounded-xl border border-tmc-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-tmc-navy">Birthdays & Important Dates</h3>
          <button onClick={openNewBirthday}
            className="flex items-center gap-1.5 bg-tmc-teal text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-tmc-teal-dark transition">
            ➕ Add Date
          </button>
        </div>
        {sortedBirthdays.length === 0 ? (
          <p className="text-sm text-gray-400">No dates saved yet. Add the birthdays you keep forgetting!</p>
        ) : (
          <div className="space-y-2">
            {sortedBirthdays.map(b => {
              const cfg = DATE_CATEGORIES[b.category] ?? DATE_CATEGORIES.other
              const age = calcAge(b.year, b.next.getFullYear())
              return (
                <div key={b.id} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{cfg.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-tmc-navy truncate">
                        {b.name}{age != null ? ` (turning ${age})` : ''}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {MONTHS_SHORT[b.month - 1]} {b.day} · {cfg.label}
                        {b.notes ? ` · ${b.notes}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urgencyClasses(b.days)}`}>
                      {formatDaysAway(b.days)}
                    </span>
                    <button onClick={() => openEditBirthday(b)} className="text-xs text-gray-400 hover:text-tmc-teal transition">Edit</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Plans & Concerts */}
      <div className="bg-white rounded-xl border border-tmc-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-tmc-navy">Plans & Concerts</h3>
          <button onClick={openNewPlan}
            className="flex items-center gap-1.5 bg-tmc-teal text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-tmc-teal-dark transition">
            ➕ Add Plan
          </button>
        </div>
        {upcomingPlans.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing on the books yet. Add a concert or plan so it doesn't sneak up on you.</p>
        ) : (
          <div className="space-y-3">
            {upcomingPlans.map(p => {
              const cfg = PLAN_TYPES[p.type] ?? PLAN_TYPES.other
              const d = new Date(p.date + 'T12:00:00')
              const days = daysUntil(new Date(d.getFullYear(), d.getMonth(), d.getDate()), today)
              return (
                <div key={p.id} className="flex items-start gap-4">
                  <div className="text-center w-10 flex-shrink-0">
                    <div className="text-xs font-medium text-gray-400">{MONTHS_SHORT[d.getMonth()]}</div>
                    <div className="text-lg font-bold text-tmc-navy leading-none">{d.getDate()}</div>
                  </div>
                  <div className="flex-1 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm text-tmc-navy">{cfg.icon} {p.title}</div>
                      {p.notes && <div className="text-xs text-gray-400 mt-0.5">{p.notes}</div>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urgencyClasses(days)}`}>
                        {formatDaysAway(days)}
                      </span>
                      <button onClick={() => openEditPlan(p)} className="text-xs text-gray-400 hover:text-tmc-teal transition">Edit</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {pastPlans.length > 0 && (
          <details className="mt-4">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Past plans ({pastPlans.length})</summary>
            <div className="mt-3 space-y-2">
              {pastPlans.map(p => {
                const cfg = PLAN_TYPES[p.type] ?? PLAN_TYPES.other
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-sm text-gray-400">
                    <span>{cfg.icon} {p.title} — {p.date}</span>
                    <button onClick={() => openEditPlan(p)} className="text-xs hover:text-tmc-teal transition">Edit</button>
                  </div>
                )
              })}
            </div>
          </details>
        )}
      </div>

      {/* Other life tools */}
      <div className="bg-white rounded-xl border border-tmc-border p-5">
        <h3 className="font-semibold text-tmc-navy mb-3">More Tools</h3>
        <a
          href={`${import.meta.env.BASE_URL}habit-tracker/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-tmc-border px-4 py-3 hover:border-tmc-teal hover:bg-tmc-teal-light transition-all"
        >
          <span className="text-xl">✅</span>
          <div>
            <div className="text-sm font-medium text-tmc-navy">Cait & Eric Habit Tracker</div>
            <div className="text-xs text-gray-400">Daily habits, streaks, and a shared idea box</div>
          </div>
        </a>
      </div>
    </div>
  )
}
