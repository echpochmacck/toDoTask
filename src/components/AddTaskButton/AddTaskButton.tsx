import type { AddTaskButtonProps } from './types'

export function AddTaskButton({ onClick, disabled = false }: AddTaskButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
        <path
          d="M10 4v12M4 10h12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      Add task
    </button>
  )
}
