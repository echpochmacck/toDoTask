import type { BoardStatus } from '../BoardStatusItem/types'

export const COLUMNS = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-violet-500',
    tint: 'bg-violet-500/5',
    description: 'Ideas for later',
    hint: 'Tasks that are not ready to be scheduled will live here.',
  },
  {
    id: 'todo',
    title: 'To do',
    color: 'bg-slate-500',
    tint: 'bg-slate-500/5',
    description: 'A fresh start',
    hint: 'Tasks you want to work on will live here.',
  },
  {
    id: 'in-progress',
    title: 'In progress',
    color: 'bg-amber-500',
    tint: 'bg-amber-500/5',
    description: 'One thing at a time',
    hint: 'Keep your current focus in this column.',
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-emerald-500',
    tint: 'bg-emerald-500/5',
    description: 'Small wins add up',
    hint: 'Your completed tasks will collect here.',
  },
] as const satisfies readonly BoardStatus[]
