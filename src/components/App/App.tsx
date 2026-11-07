import { useState } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../../entities/task'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { TaskForm } from '../TaskForm/TaskForm'
import { Board } from '../Board/Board'
import { ModalComponent } from '../ModalComponent/ModalComponent'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

const TASKS_STORAGE_KEY = 'task-board:v1'
const EMPTY_TASKS: Task[] = []
const taskStatuses = new Set<TaskStatus>(['backlog', 'todo', 'in-progress', 'done'])
const taskPriorities = new Set<TaskPriority>(['low', 'medium', 'high'])

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false

  const task = value as Record<string, unknown>
  return typeof task.id === 'string'
    && typeof task.title === 'string'
    && (task.description === undefined || typeof task.description === 'string')
    && (task.dueDate === undefined || typeof task.dueDate === 'string')
    && typeof task.status === 'string'
    && taskStatuses.has(task.status as TaskStatus)
    && typeof task.priority === 'string'
    && taskPriorities.has(task.priority as TaskPriority)
}

function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask)
}

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, EMPTY_TASKS, isTaskList)
  const [taskModal, setTaskModal] = useState<{ mode: 'create'; status?: TaskStatus } | { mode: 'edit'; taskId: Task['id'] } | null>(null)
  const editingTask = taskModal?.mode === 'edit'
    ? tasks.find((task) => task.id === taskModal.taskId)
    : undefined

  const deleteTask = (taskId: Task['id']) => {
    const deletedTaskIndex = tasks.findIndex((task) => task.id === taskId)
    const deletedTask = tasks[deletedTaskIndex]
    if (!deletedTask) return

    setTasks((current) => current.filter((task) => task.id !== taskId))
    toast('Task deleted', {
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks((current) => {
            if (current.some((task) => task.id === deletedTask.id)) return current
            const restored = [...current]
            restored.splice(Math.min(deletedTaskIndex, restored.length), 0, deletedTask)
            return restored
          })
        },
      },
    })
  }

  return (
    <main className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 sm:py-8">
      <header className="mb-6 flex items-start justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My task board
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Make room for what matters. One task at a time.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <Board
        tasks={tasks}
        onAddTask={(status) => setTaskModal({ mode: 'create', status })}
        onQuickAddTask={(title, status) => {
          setTasks((current) => [...current, {
            id: crypto.randomUUID(),
            title,
            status,
            priority: 'medium',
          }])
        }}
        onEditTask={(taskId) => setTaskModal({ mode: 'edit', taskId })}
        onTaskStatusChange={(taskId, status) => {
          setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task))
        }}
        onTasksReorder={setTasks}
        onMoveTask={(taskId, status) => {
          setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task))
        }}
        onDuplicateTask={(taskId) => {
          setTasks((current) => {
            const taskIndex = current.findIndex((task) => task.id === taskId)
            const task = current[taskIndex]
            if (!task) return current
            const duplicate = { ...task, id: crypto.randomUUID(), title: `${task.title} (copy)` }
            const nextTasks = [...current]
            nextTasks.splice(taskIndex + 1, 0, duplicate)
            return nextTasks
          })
        }}
        onDeleteTask={deleteTask}
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
            initialValues={editingTask ?? (taskModal.mode === 'create' ? { status: taskModal.status } : undefined)}
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
      <Toaster />
    </main>
  )
}

export default App
