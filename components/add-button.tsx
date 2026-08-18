'use client'

import { useState } from 'react'
import { BellPlus, CalendarPlus, Plus, X } from 'lucide-react'

const actions = [
  { icon: BellPlus, label: 'Nuovo promemoria', accent: 'bg-study/15 text-study' },
  { icon: CalendarPlus, label: 'Sincronizza verifica', accent: 'bg-exam/15 text-exam' },
]

export function AddButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto flex max-w-md flex-col items-end px-5">
      {open && (
        <div
          className="pointer-events-auto mb-3 flex flex-col items-end gap-2"
          role="menu"
          aria-label="Aggiungi rapido"
        >
          {actions.map(({ icon: Icon, label, accent }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-full bg-card py-2 pl-3 pr-4 text-sm font-medium shadow-lg ring-1 ring-border transition-transform active:scale-95"
            >
              <span className={`flex size-8 items-center justify-center rounded-full ${accent}`}>
                <Icon className="size-4" aria-hidden />
              </span>
              {label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Chiudi menu' : 'Aggiungi promemoria o verifica'}
        className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 transition-transform active:scale-90"
      >
        <span className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          {open ? <X className="size-6" aria-hidden /> : <Plus className="size-6" aria-hidden />}
        </span>
      </button>
    </div>
  )
}
