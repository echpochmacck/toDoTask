import { useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { CheckCircle2, ListTodo, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TaskPriority } from '@/entities/task'
import { AddTaskButton } from '../AddTaskButton/AddTaskButton'
import { BoardStatusItem } from '../BoardStatusItem/BoardStatusItem'
import { SearchField } from '../SearchField/SearchField'
import type { BoardStatus } from '../BoardStatusItem/types'

import type { BoardProps } from './types'

const columns = [
  {
    id: 'backlog',
    title: 'Backlog',
    dotColor: 'bg-violet-400',
    description: 'Ideas for later',
    hint: 'Tasks that are not ready to be scheduled will live here.',
  },
  {
    id: 'todo',
    title: 'To do',
    dotColor: 'bg-slate-400',
    description: 'A fresh start',
    hint: 'Tasks you want to work on will live here.',
  },
  {
    id: 'in-progress',
    title: 'In progress',
    dotColor: 'bg-amber-400',
    description: 'One thing at a time',
    hint: 'Keep your current focus in this column.',
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-teal-500',
    description: 'Small wins add up',
    hint: 'Your completed tasks will collect here.',
  },
] as const satisfies readonly BoardStatus[]

export function Board({ tasks = [], onAddTask, onDeleteTask, onTaskStatusChange, onEditTask }: BoardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const hasActiveFilters = Boolean(normalizedQuery) || priorityFilter !== 'all'
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = !normalizedQuery
      || `${task.title} ${task.description ?? ''}`.toLocaleLowerCase().includes(normalizedQuery)
    return matchesSearch && (priorityFilter === 'all' || task.priority === priorityFilter)
  })
  const completedTasks = tasks.filter((task) => task.status === 'done').length

  const clearFilters = () => {
    setSearchQuery('')
    setPriorityFilter('all')
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return
        const { source, target } = event.operation
        const task = tasks.find((item) => item.id === source?.id)
        const column = columns.find((item) => item.id === target?.id)
        if (task && column && task.status !== column.id) {
          onTaskStatusChange(task.id, column.id)
        }
      }}
    >
      <section aria-label="Kanban task board">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 px-1 text-sm">
            <div className="flex items-center gap-2">
              <ListTodo aria-hidden="true" className="size-4 text-muted-foreground" />
              <span className="font-semibold">{tasks.length}</span>
              <span className="text-muted-foreground">Total</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
              <span className="font-semibold">{completedTasks}</span>
              <span className="text-muted-foreground">Completed</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchField value={searchQuery} onChange={setSearchQuery} />
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}>
              <SelectTrigger aria-label="Filter by priority" className="w-full sm:w-40">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High priority</SelectItem>
                <SelectItem value="medium">Medium priority</SelectItem>
                <SelectItem value="low">Low priority</SelectItem>
              </SelectContent>
            </Select>
            <AddTaskButton onClick={onAddTask} />
          </div>
        </div>
        <div className="mb-3 flex min-h-7 items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing <span className="font-medium text-foreground">{visibleTasks.length}</span> of {tasks.length} tasks
          </p>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs text-muted-foreground">
              <X aria-hidden="true" className="size-3.5" />
              Clear filters
            </Button>
          )}
        </div>
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <BoardStatusItem
              key={column.id}
              status={column}
              isFiltered={hasActiveFilters}
              onTaskStatusChange={onTaskStatusChange}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              tasks={visibleTasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
      </section>
    </DragDropProvider>
  )
}
