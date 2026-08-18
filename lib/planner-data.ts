export type Category = 'study' | 'exam' | 'social'
export type Priority = 'alta' | 'media' | 'bassa'

export type Task = {
  id: string
  title: string
  subject: string
  time: string
  category: Category
  priority: Priority
  done: boolean
}

export const categoryMeta: Record<
  Category,
  { label: string; dot: string; text: string; soft: string; ring: string }
> = {
  study: {
    label: 'Studio',
    dot: 'bg-study',
    text: 'text-study',
    soft: 'bg-study/12',
    ring: 'ring-study/30',
  },
  exam: {
    label: 'Verifiche',
    dot: 'bg-exam',
    text: 'text-exam',
    soft: 'bg-exam/12',
    ring: 'ring-exam/30',
  },
  social: {
    label: 'Eventi',
    dot: 'bg-social',
    text: 'text-social',
    soft: 'bg-social/12',
    ring: 'ring-social/30',
  },
}

export const priorityMeta: Record<Priority, { label: string; className: string }> = {
  alta: { label: 'Alta', className: 'bg-exam/15 text-exam' },
  media: { label: 'Media', className: 'bg-streak/15 text-streak' },
  bassa: { label: 'Bassa', className: 'bg-social/15 text-social' },
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Ripasso Divina Commedia',
    subject: 'Italiano',
    time: '15:30',
    category: 'study',
    priority: 'media',
    done: true,
  },
  {
    id: '2',
    title: 'Esercizi di analisi matematica',
    subject: 'Matematica',
    time: '17:00',
    category: 'study',
    priority: 'alta',
    done: false,
  },
  {
    id: '3',
    title: 'Compito in classe — Latino',
    subject: 'Versione + grammatica',
    time: 'Dom 08:00',
    category: 'exam',
    priority: 'alta',
    done: false,
  },
  {
    id: '4',
    title: 'Interrogazione di Storia',
    subject: 'Risorgimento italiano',
    time: 'Mar 10:15',
    category: 'exam',
    priority: 'media',
    done: false,
  },
  {
    id: '5',
    title: 'Assemblea studentesca',
    subject: 'Aula magna',
    time: '11:00',
    category: 'social',
    priority: 'bassa',
    done: false,
  },
  {
    id: '6',
    title: 'Ripetizioni con Giulia',
    subject: 'Fisica',
    time: '18:30',
    category: 'social',
    priority: 'bassa',
    done: false,
  },
]
