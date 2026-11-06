import { AddTaskButton } from '../AddTaskButton/AddTaskButton'
import { BoardStatusItem } from '../BoardStatusItem/BoardStatusItem'
import type { BoardStatus } from '../BoardStatusItem/types'
import type { Task } from '../TaskItem/types'
import type { BoardProps } from './types'

// Preview data until task creation is implemented.
const exampleTasks: Task[] = [
  {
    id: '1',
    title: 'Plan the week',
    description: 'Pick three things to focus on this week.',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Build the task board',
    description: 'Give every task a place to call home.',
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'Set up the project',
    status: 'done',
  },
]

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

export function Board({ tasks = exampleTasks, onAddTask }: BoardProps) {
  return (
    <section aria-label="Kanban task board">
      <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Overview</h2>
          <p className="mt-1 text-xs text-slate-500">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
        </div>
        <AddTaskButton onClick={onAddTask} />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {columns.map((column) => (
          <BoardStatusItem
            key={column.id}
            status={column}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </div>
    </section>
  )
}
