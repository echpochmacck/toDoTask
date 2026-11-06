import type { TaskItemProps } from './types'

function getCompletionIndicatorClasses(isCompleted: boolean) {
  return isCompleted
    ? 'border-teal-500 bg-teal-500 text-white'
    : 'border-slate-300'
}

function getTitleClasses(isCompleted: boolean) {
  return isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
}

export function TaskItem({ task }: TaskItemProps) {
  const isCompleted = task.status === 'done'

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${getCompletionIndicatorClasses(isCompleted)}`}
        >
          {isCompleted && (
            <svg viewBox="0 0 16 16" fill="none" className="size-3">
              <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-medium wrap-anywhere ${getTitleClasses(isCompleted)}`}>
            {task.title}
            {isCompleted && <span className="sr-only"> (completed)</span>}
          </h4>
          {task.description && (
            <p className="mt-2 text-xs leading-5 whitespace-pre-line text-slate-500 wrap-anywhere">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
