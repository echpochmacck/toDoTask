import { useEffect, useState } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../../entities/task'
import { exampleTasks } from '../../entities/task/exampleTasks'
import { TaskForm } from '../TaskForm/TaskForm'
import { Board } from '../Board/Board'
import { ModalComponent } from '../ModalComponent/ModalComponent'

const TASKS_STORAGE_KEY = 'task-board.tasks'
const taskStatuses = new Set<TaskStatus>(['backlog', 'todo', 'in-progress', 'done'])
const taskPriorities = new Set<TaskPriority>(['low', 'medium', 'high'])

function parseTask(value: unknown): Task | null {
  if (!value || typeof value !== 'object') return null

  const task = value as Record<string, unknown>
  if (typeof task.id !== 'string'
    || typeof task.title !== 'string'
    || (task.description !== undefined && typeof task.description !== 'string')
    || typeof task.status !== 'string'
    || !taskStatuses.has(task.status as TaskStatus)
    || (task.priority !== undefined && (typeof task.priority !== 'string' || !taskPriorities.has(task.priority as TaskPriority)))) {
    return null
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description as string | undefined,
    status: task.status as TaskStatus,
    priority: (task.priority as TaskPriority | undefined) ?? 'medium',
  }
}

function loadTasks(): Task[] {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (savedTasks === null) return exampleTasks

    const parsedTasks: unknown = JSON.parse(savedTasks)
    if (!Array.isArray(parsedTasks)) return exampleTasks

    const tasks = parsedTasks.map(parseTask)
    return tasks.every((task): task is Task => task !== null) ? tasks : exampleTasks
  } catch {
    return exampleTasks
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [taskModal, setTaskModal] = useState<{ mode: 'create' } | { mode: 'edit'; taskId: Task['id'] } | null>(null)
  const editingTask = taskModal?.mode === 'edit'
    ? tasks.find((task) => task.id === taskModal.taskId)
    : undefined

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Keep the board usable when storage is unavailable or full.
    }
  }, [tasks])

  return (
    <main className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 sm:py-8">
      <header className="mb-6 border-b pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My task board
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Make room for what matters. One task at a time.
        </p>
      </header>
      <Board
        tasks={tasks}
        onAddTask={() => setTaskModal({ mode: 'create' })}
        onEditTask={(taskId) => setTaskModal({ mode: 'edit', taskId })}
        onTaskStatusChange={(taskId, status) => {
          setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task))
        }}
        onDeleteTask={(taskId) => {
          setTasks((current) => current.filter((task) => task.id !== taskId))
        }}
      />
      <ModalComponent
        isOpen={taskModal !== null}
        onClose={() => setTaskModal(null)}
        title={editingTask ? 'Edit task' : 'Create task'}
        description={editingTask ? 'Update the task details, status, or priority.' : 'Add a task to your board.'}
      >
        {taskModal && (
          <TaskForm
            key={editingTask?.id ?? 'create'}
            initialValues={editingTask}
            submitLabel={editingTask ? 'Save changes' : 'Create task'}
            onCancel={() => setTaskModal(null)}
            onSubmit={(values) => {
              if (editingTask) {
                setTasks((current) => current.map((task) => task.id === editingTask.id ? { ...task, ...values } : task))
              } else {
                setTasks((current) => [...current, { ...values, id: crypto.randomUUID() }])
              }
              setTaskModal(null)
            }}
          />
        )}
      </ModalComponent>
    </main>
  )
}

export default App
