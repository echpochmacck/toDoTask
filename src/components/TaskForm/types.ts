import type { Task } from '../../entities/task'

export type TaskFormValues = Omit<Task, 'id'>

export type TaskFormProps = {
  onSubmit: (task: TaskFormValues) => void
  onCancel: () => void
}
