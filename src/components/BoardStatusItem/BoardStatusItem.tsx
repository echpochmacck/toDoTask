import { useId } from 'react'
import { TaskItem } from '../TaskItem/TaskItem'
import type { BoardStatusItemProps } from './types'

export function BoardStatusItem({ status, tasks }: BoardStatusItemProps) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className="min-h-72 rounded-2xl border border-slate-200/80 bg-slate-100/60 p-4 md:min-h-96"
    >
      <header className="flex items-center gap-2.5 px-1 py-2">
        <span aria-hidden="true" className={`size-2 rounded-full ${status.dotColor}`} />
        <h3 id={headingId} className="text-sm font-semibold text-slate-700">
          {status.title}
        </h3>
        <span className="ml-auto rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
          {tasks.length}
        </span>
      </header>

      {tasks.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem task={task} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
          <p className="text-sm font-medium text-slate-600">{status.description}</p>
          <p className="mx-auto mt-2 max-w-48 text-xs leading-5 text-slate-400">
            {status.hint}
          </p>
        </div>
      )}
    </section>
  )
}
