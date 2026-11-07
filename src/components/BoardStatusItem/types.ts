import type { Task, TaskStatus } from '../../entities/task'

export type BoardStatus = {
  id: TaskStatus
  title: string
  dotColor: string
  description: string
  hint: string
}

export type BoardStatusItemProps = {
  status: BoardStatus
  tasks: Task[]
  isFiltered?: boolean
  onTaskStatusChange: (taskId: Task['id'], status: TaskStatus) => void
  onDeleteTask: (taskId: Task['id']) => void
  onEditTask: (taskId: Task['id']) => void
}

