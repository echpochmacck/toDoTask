import type { Task, TaskStatus } from '../../entities/task'

export type TaskItemProps = {
  task: Task
  onTaskStatusChange: (taskId: Task['id'], status: TaskStatus) => void
  onDeleteTask: (taskId: Task['id']) => void
  onEditTask: (taskId: Task['id']) => void
}
