import { useState } from 'react'
import type { Task } from '../../entities/task'
import { exampleTasks } from '../../entities/task/exampleTasks'
import { TaskForm } from '../TaskForm/TaskForm'
import { Board } from '../Board/Board'
import { ModalComponent } from '../ModalComponent/ModalComponent'

function App() {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          A little focus, every day
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          My task board
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Make room for what matters. One task at a time.
        </p>
      </header>
      <Board
        tasks={tasks}
        onAddTask={() => setIsCreateModalOpen(true)}
        onTaskStatusChange={(taskId, status) => {
          setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task))
        }}
        onDeleteTask={(taskId) => {
          setTasks((current) => current.filter((task) => task.id !== taskId))
        }}
      />
      <ModalComponent
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create task"
      >
        {isCreateModalOpen && (
          <TaskForm
            onCancel={() => setIsCreateModalOpen(false)}
            onSubmit={(values) => {
              setTasks((current) => [...current, { ...values, id: crypto.randomUUID() }])
              setIsCreateModalOpen(false)
            }}
          />
        )}
      </ModalComponent>
    </main>
  )
}

export default App
