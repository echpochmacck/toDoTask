import type { AddTaskButtonProps } from '../AddTaskButton/types'
import type { Task } from '../TaskItem/types'

export type BoardProps = {
  tasks?: Task[]
  onAddTask?: AddTaskButtonProps['onClick']
}
