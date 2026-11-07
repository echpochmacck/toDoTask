import type { Task, TaskStatus } from '../../entities/task'

export type BoardProps = {
  tasks?: Task[]
  onTaskStatusChange: (taskId: Task['id'], status: TaskStatus) => void
  onTasksReorder: (tasks: Task[]) => void
  onDeleteTask: (taskId: Task['id']) => void
  onDuplicateTask: (taskId: Task['id']) => void
  onEditTask: (taskId: Task['id']) => void
  onMoveTask: (taskId: Task['id'], status: TaskStatus) => void
  onAddTask: (status?: TaskStatus) => void
  onQuickAddTask: (title: string, status: TaskStatus) => void
}

