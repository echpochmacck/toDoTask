import type { Task } from '../../entities/task'

export type TaskItemProps = {
  task: Task
  onDeleteTask: (taskId: Task['id']) => void
  onEditTask: (taskId: Task['id']) => void
}
