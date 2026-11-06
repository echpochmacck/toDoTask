import type { AddTaskButtonProps } from '../AddTaskButton/types'
import type { Task, TaskStatus } from '../../entities/task'

export type BoardProps = {
  tasks?: Task[]
  onTaskStatusChange: (taskId: Task['id'], status: TaskStatus) => void
  onDeleteTask: (taskId: Task['id']) => void
  onAddTask?: AddTaskButtonProps['onClick']
}

