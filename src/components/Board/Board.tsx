import { useState } from 'react'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { SearchX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Task, TaskPriority } from '@/entities/task'
import { sortTasksByPriority } from '@/entities/task/sortTasksByPriority'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { AddTaskButton } from '../AddTaskButton/AddTaskButton'
import { BoardStatusItem } from '../BoardStatusItem/BoardStatusItem'
import { SearchField } from '../SearchField/SearchField'
import { COLUMNS } from './columns'
import type { BoardProps } from './types'

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

export function Board({ tasks = [], onAddTask, onQuickAddTask, onDeleteTask, onDuplicateTask, onTaskStatusChange, onTasksReorder, onEditTask, onMoveTask }: BoardProps) {
  const [manualOrder, setManualOrder] = useLocalStorage('task-board:manual-order:v1', false, isBoolean)
  const [activeTaskId, setActiveTaskId] = useState<Task['id'] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const hasActiveFilters = Boolean(normalizedQuery) || priorityFilter !== 'all'
  const orderedTasks = manualOrder
    ? tasks
    : COLUMNS.reduce<Task[]>((current, column) => sortTasksByPriority(current, column.id), tasks)
  const visibleTasks = orderedTasks.filter((task) => {
    const matchesSearch = !normalizedQuery
      || `${task.title} ${task.description ?? ''}`.toLocaleLowerCase().includes(normalizedQuery)
    return matchesSearch && (priorityFilter === 'all' || task.priority === priorityFilter)
  })
  const completedTasks = tasks.filter((task) => task.status === 'done').length
  const completionPercentage = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100)
  const activeTask = tasks.find((task) => task.id === activeTaskId)

  const clearFilters = () => {
    setSearchQuery('')
    setPriorityFilter('all')
  }

  return (
    <DragDropProvider
      onDragStart={(event) => {
        setActiveTaskId(String(event.operation.source?.id ?? ''))
      }}
      onDragEnd={(event) => {
        setActiveTaskId(null)
        if (event.canceled) return
        const { source, target } = event.operation
        const task = orderedTasks.find((item) => item.id === source?.id)
        const targetTask = orderedTasks.find((item) => item.id === target?.id)
        const column = COLUMNS.find((item) => item.id === target?.id)
        if (!task || !target) return
        if (source?.id === target.id) return

        const targetStatus = targetTask?.status ?? column?.id
        if (!targetStatus) return

        const remainingTasks = orderedTasks.filter((item) => item.id !== task.id)
        const movedTask = { ...task, status: targetStatus }
        let insertionIndex = remainingTasks.length

        if (targetTask) {
          insertionIndex = remainingTasks.findIndex((item) => item.id === targetTask.id)
          if (insertionIndex < 0) insertionIndex = remainingTasks.length

          if (isSortable(source) && isSortable(target)
            && source.sortable.group === target.sortable.group
            && source.sortable.index < target.sortable.index) {
            insertionIndex += 1
          }
        } else {
          const lastColumnTaskIndex = remainingTasks.findLastIndex((item) => item.status === targetStatus)
          if (lastColumnTaskIndex >= 0) insertionIndex = lastColumnTaskIndex + 1
        }

        const nextTasks = [...remainingTasks]
        nextTasks.splice(insertionIndex, 0, movedTask)
        setManualOrder(true)
        onTasksReorder(nextTasks)
      }}
    >
      <section aria-label="Kanban task board">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 px-1 text-sm">
            <p className="whitespace-nowrap">
              <span className="font-semibold tabular-nums">{tasks.length}</span> tasks
              <span className="mx-1.5 text-muted-foreground">·</span>
              <span className="font-semibold tabular-nums">{completedTasks}</span> done
            </p>
            <Progress value={completionPercentage} aria-label={`${completionPercentage}% complete`} className="h-1.5 w-30" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchField value={searchQuery} onChange={setSearchQuery} />
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}>
              <SelectTrigger aria-label="Filter by priority" className={priorityFilter === 'all' ? 'w-full sm:w-40' : 'w-full border-primary bg-primary/5 sm:w-40'}>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High priority</SelectItem>
                <SelectItem value="medium">Medium priority</SelectItem>
                <SelectItem value="low">Low priority</SelectItem>
              </SelectContent>
            </Select>
            {priorityFilter !== 'all' && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setPriorityFilter('all')} className="text-muted-foreground">
                Reset
              </Button>
            )}
            <AddTaskButton onClick={() => onAddTask()} />
          </div>
        </div>
        {hasActiveFilters && visibleTasks.length > 0 && (
          <div className="mb-3 flex min-h-7 items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              Showing <span className="font-medium text-foreground">{visibleTasks.length}</span> of {tasks.length} tasks
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs text-muted-foreground">
              <X aria-hidden="true" className="size-3.5" />
              Clear filters
            </Button>
          </div>
        )}
        {hasActiveFilters && visibleTasks.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
            <SearchX aria-hidden="true" className="size-7 text-muted-foreground/70" />
            <h2 className="mt-3 text-sm font-medium">Nothing found</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or priority.</p>
            <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="mt-4">Clear filters</Button>
          </div>
        ) : (
          <div className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {COLUMNS.map((column) => (
              <BoardStatusItem
                key={column.id}
                status={column}
                isFiltered={hasActiveFilters}
                onQuickAddTask={onQuickAddTask}
                onTaskStatusChange={onTaskStatusChange}
                onDeleteTask={onDeleteTask}
                onDuplicateTask={onDuplicateTask}
                onEditTask={onEditTask}
                onMoveTask={onMoveTask}
                tasks={visibleTasks.filter((task) => task.status === column.id)}
              />
            ))}
          </div>
        )}
      </section>
      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
        {activeTask && (
          <Card className="w-72 rotate-1 scale-[1.02] py-0 shadow-xl motion-reduce:rotate-0 motion-reduce:scale-100">
            <CardContent className="p-4">
              <p className="line-clamp-2 text-sm font-medium">{activeTask.title}</p>
              {activeTask.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{activeTask.description}</p>
              )}
            </CardContent>
          </Card>
        )}
      </DragOverlay>
    </DragDropProvider>
  )
}
