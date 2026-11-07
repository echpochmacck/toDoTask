import type { Task, TaskStatus } from '../../entities/task'

export type BoardStatus = {
  id: TaskStatus
  title: string
  color: string
  tint: string
  description: string
  hint: string
}

export type BoardStatusItemProps = {
  status: BoardStatus
  tasks: Task[]
  isFiltered?: boolean
  onQuickAddTask: (title: string, status: TaskStatus) => void
  onTaskStatusChange: (taskId: Task['id'], status: TaskStatus) => void
  onDeleteTask: (taskId: Task['id']) => void
  onDuplicateTask: (taskId: Task['id']) => void
  onEditTask: (taskId: Task['id']) => void
  onMoveTask: (taskId: Task['id'], status: TaskStatus) => void
}

