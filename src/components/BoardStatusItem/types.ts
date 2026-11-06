import type { Task, TaskStatus } from '../TaskItem/types'

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
}
