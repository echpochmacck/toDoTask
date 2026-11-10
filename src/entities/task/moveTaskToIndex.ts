import type { Task, TaskStatus } from './types'

/** Move one task to a zero-based position within its destination column. */
export function moveTaskToIndex(tasks: readonly Task[], taskId: Task['id'], status: TaskStatus, index: number): Task[] {
  const task = tasks.find((item) => item.id === taskId)
  if (!task) return [...tasks]

  const remaining = tasks.filter((item) => item.id !== taskId)
  const columnTasks = remaining.filter((item) => item.status === status)
  const position = Math.max(0, Math.min(index, columnTasks.length))
  const nextTask = columnTasks[position]
  const lastColumnIndex = remaining.findLastIndex((item) => item.status === status)
  const insertionIndex = nextTask
    ? remaining.findIndex((item) => item.id === nextTask.id)
    : lastColumnIndex < 0 ? remaining.length : lastColumnIndex + 1
  const next = [...remaining]
  next.splice(insertionIndex, 0, { ...task, status })
  return next
}
