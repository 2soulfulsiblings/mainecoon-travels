import { useState } from 'react'

const EVENT_TYPES = {
  launch:   { label: 'Product Launch',   color: 'bg-green-100 text-green-800 border-green-200',  dot: 'bg-green-500'  },
  social:   { label: 'Social Post',      color: 'bg-blue-100 text-blue-800 border-blue-200',     dot: 'bg-blue-500'   },
  travel:   { label: 'Travel',           color: 'bg-tmc-amber-light text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  sale:     { label: 'Sale / Promo',     color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  design:   { label: 'Design Day',       color: 'bg-tmc-teal-light text-tmc-teal border-tmc-teal/20', dot: 'bg-tmc-teal' },
  other:    { label: 'Other',            color: 'bg-gray-100 text-gray-700 border-gray-200',     dot: 'bg-gray-400'   },
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const SEED_EVENTS = [
  { id: 'ev-001', date: '2026-07-04', type: 'sale',   title: '4th of July Sale',          notes: '20% off all prints' },
  { id: 'ev-002', date: '2026-07-10', type: 'social', title: 'Instagram: Stevie van shot', notes: 'Use road trip reel' },
  { id: 'ev-003', date: '2026-07-15', type: 'launch', title: 'Adventure Cat Sticker Pack', notes: 'List on Etsy + post on IG' },
  { id: 'ev-004', date: '2026-08-01', type: 'travel', title: 'Road trip to NOLA 🎺',       notes: 'Content creation week!' },
  { id: 'ev-005', date: '2026-09-01', type: 'launch', title: 'Back to school sale drops',  notes: 'Mugs and totes go live' },
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}
function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function EventBadge({ event, onClick }) {
  const cfg = EVENT_TYPES[event.type] ?? EVENT_TYPES.other
  return (
    <button
      onClick={() => onClick(event)}
      className={`w-full text-left text-xs px-1.5 py-0.5 rounded border truncate ${cfg.color} hover:opacity-80 transition`}
      title={event.title}
    >
      {event.title}
    </button>
  )
}

function EventModal({ event, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    type: 'social', title: '', notes: '', date: '', ...event
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-tmc-navy">{event.id ? 'Edit Event' : 'New Event'}</h2>
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
              {Object.entries(EVENT_TYPES).map(([id, t]) => (
                <option key={id} value={id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal"
              placeholder="What's happening?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 resize-none"
              placeholder="Any details..." />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div>
            {event.id && (
              <button onClick={() => onDelete(event.id)}
                className="text-sm text-red-400 hover:text-red-600 transition">
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            <button
              onClick={() => { if (form.title && form.date) onSave(form) }}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-tmc-teal text-white hover:bg-tmc-teal-dark transition"
            >
              {event.id ? 'Save' : 'Add Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContentCalendar({ events, setEvents }) {
  const today = new Date()
  const [year, setYear]     = useState(today.getFullYear())
  const [month, setMonth]   = useState(today.getMonth())
  const [modal, setModal]   = useState(null)
  const [editing, setEdit]  = useState(null)
  const [clickDate, setClickDate] = useState(null)

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const openNew = (date) => {
    setEdit({ type: 'social', title: '', notes: '', date })
    setModal('form')
  }
  const openEdit = (ev) => { setEdit({ ...ev }); setModal('form') }

  const handleSave = (form) => {
    if (form.id) {
      setEvents(prev => prev.map(e => e.id === form.id ? { ...form } : e))
    } else {
      setEvents(prev => [...prev, { ...form, id: `ev-${Date.now()}` }])
    }
    setModal(null)
  }
  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    setModal(null)
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfWeek(year, month)
  const cells = Array.from({ length: firstDay }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const monthEvents = events.filter(e => {
    const d = new Date(e.date + 'T12:00:00')
    return d.getFullYear() === year && d.getMonth() === month
  })

  const eventsForDay = (day) => {
    const iso = isoDate(year, month, day)
    return monthEvents.filter(e => e.date === iso)
  }

  const upcomingEvents = [...events]
    .filter(e => new Date(e.date + 'T12:00:00') >= new Date(today.toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {modal === 'form' && editing && (
        <EventModal event={editing} onSave={handleSave} onDelete={handleDelete} onClose={() => setModal(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-tmc-navy">Content Calendar 📅</h2>
          <p className="text-sm text-gray-500 mt-0.5">Plan product launches, social posts, travel, and sales.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`${import.meta.env.BASE_URL}social-pic-picker/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-tmc-border px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:border-tmc-teal hover:bg-tmc-teal-light hover:text-tmc-teal-dark transition"
          >
            📸 Pic Picker
          </a>
          <button
            onClick={() => openNew(isoDate(year, month, today.getDate()))}
            className="flex items-center gap-2 bg-tmc-teal text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-tmc-teal-dark transition"
          >
            ➕ Add Event
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(EVENT_TYPES).map(([id, t]) => (
          <span key={id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-2 h-2 rounded-full ${t.dot}`} />
            {t.label}
          </span>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-tmc-border overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="text-gray-400 hover:text-tmc-teal transition text-lg px-2">‹</button>
          <h3 className="font-bold text-tmc-navy text-lg">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="text-gray-400 hover:text-tmc-teal transition text-lg px-2">›</button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const iso = day ? isoDate(year, month, day) : null
            const dayEvents = day ? eventsForDay(day) : []
            const isToday = iso === today.toISOString().slice(0, 10)

            return (
              <div
                key={i}
                onClick={() => day && openNew(iso)}
                className={`min-h-20 border-b border-r border-gray-50 p-1.5 cursor-pointer hover:bg-tmc-teal-light/50 transition group
                  ${!day ? 'bg-gray-50/50 cursor-default' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full
                      ${isToday ? 'bg-tmc-teal text-white' : 'text-gray-500 group-hover:text-tmc-teal'}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map(ev => (
                        <EventBadge key={ev.id} event={ev} onClick={(e) => { e.stopPropagation?.(); openEdit(ev) }} />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-white rounded-xl border border-tmc-border p-5">
        <h3 className="font-semibold text-tmc-navy mb-4">Coming Up</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing scheduled yet. Click a day on the calendar to add an event.</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map(ev => {
              const cfg = EVENT_TYPES[ev.type] ?? EVENT_TYPES.other
              const d = new Date(ev.date + 'T12:00:00')
              return (
                <div key={ev.id} className="flex items-start gap-4">
                  <div className="text-center w-10 flex-shrink-0">
                    <div className="text-xs font-medium text-gray-400">{MONTHS[d.getMonth()].slice(0, 3)}</div>
                    <div className="text-lg font-bold text-tmc-navy leading-none">{d.getDate()}</div>
                  </div>
                  <div className="flex-1 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm text-tmc-navy">{ev.title}</div>
                      {ev.notes && <div className="text-xs text-gray-400 mt-0.5">{ev.notes}</div>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <button onClick={() => openEdit(ev)} className="text-xs text-gray-400 hover:text-tmc-teal transition">Edit</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
