import type { Task, TaskPriority, TaskStatus } from './types'

const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }

/** Sort one column without changing task positions in other columns. */
export function sortTasksByPriority(tasks: readonly Task[], status: TaskStatus): Task[] {
  const ordered = tasks
    .filter((task) => task.status === status)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  let nextIndex = 0
  return tasks.map((task) => task.status === status ? ordered[nextIndex++] : task)
}
