import type { Task } from '@/entities/task'
import { moveTaskToIndex } from '@/entities/task/moveTaskToIndex'
import { COLUMNS } from './columns'

/** Resolve a drop using task IDs, so filtered-out cards do not skew indices. */
export function reorderTaskOnDrop(tasks: readonly Task[], sourceId: string, targetId: string): Task[] | null {
  const task = tasks.find((item) => item.id === sourceId)
  const targetTask = tasks.find((item) => item.id === targetId)
  const column = COLUMNS.find((item) => item.id === targetId)
  if (!task || sourceId === targetId) return null
  const status = column?.id ?? targetTask?.status
  if (!status) return null

  const columnTasks = tasks.filter((item) => item.status === status)
  const remainingColumnTasks = columnTasks.filter((item) => item.id !== task.id)
  const sourceIndex = columnTasks.findIndex((item) => item.id === task.id)
  const targetIndex = targetTask
    ? remainingColumnTasks.findIndex((item) => item.id === targetTask.id)
    : -1
  const targetOriginalIndex = targetTask
    ? columnTasks.findIndex((item) => item.id === targetTask.id)
    : -1
  const index = column
    ? remainingColumnTasks.length
    : targetIndex + (task.status === status && sourceIndex < targetOriginalIndex ? 1 : 0)
  if (task.status === status && index === sourceIndex) return null

  return moveTaskToIndex(tasks, task.id, status, index)
}
