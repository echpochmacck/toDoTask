import type { AddTaskButtonProps } from '../AddTaskButton/types'
import type { Task } from '../../entities/task'

export type BoardProps = {
  tasks?: Task[]
  onDeleteTask: (taskId: Task['id']) => void
  onAddTask?: AddTaskButtonProps['onClick']
}

