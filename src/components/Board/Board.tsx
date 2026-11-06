import { Separator } from '@/components/ui/separator'
import { AddTaskButton } from '../AddTaskButton/AddTaskButton'
import { BoardStatusItem } from '../BoardStatusItem/BoardStatusItem'
import type { BoardStatus } from '../BoardStatusItem/types'

import type { BoardProps } from './types'

const columns = [
  {
    id: 'todo',
    title: 'To do',
    dotColor: 'bg-slate-400',
    description: 'A fresh start',
    hint: 'Tasks you want to work on will live here.',
  },
  {
    id: 'in-progress',
    title: 'In progress',
    dotColor: 'bg-amber-400',
    description: 'One thing at a time',
    hint: 'Keep your current focus in this column.',
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-teal-500',
    description: 'Small wins add up',
    hint: 'Your completed tasks will collect here.',
  },
] as const satisfies readonly BoardStatus[]

export function Board({ tasks = [], onAddTask, onDeleteTask }: BoardProps) {
  return (
    <section aria-label="Kanban task board">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Overview</h2>
          <p className="mt-1 text-xs text-muted-foreground">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
        </div>
        <AddTaskButton onClick={onAddTask} />
      </div>

      <Separator className="mb-5" />
      <div className="grid gap-5 md:grid-cols-3">
        {columns.map((column) => (
          <BoardStatusItem
            key={column.id}
            status={column}
            onDeleteTask={onDeleteTask}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </div>
    </section>
  )
}
