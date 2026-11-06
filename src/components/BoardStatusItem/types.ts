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
  onDeleteTask: (taskId: Task['id']) => void
}

