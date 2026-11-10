import { useSortable } from '@dnd-kit/react/sortable'
import { Calendar, Check, Copy, Flag, GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TaskPriority } from '@/entities/task'
import { COLUMNS } from '../Board/columns'
import type { TaskItemProps } from './types'

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  high: 'bg-red-500/10 text-red-700 dark:text-red-300',
}

function formatDueDate(dueDate: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
    .format(new Date(`${dueDate}T00:00:00`))
}

function getLocalDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function TaskItem({ task, index, onTaskStatusChange, onDeleteTask, onDuplicateTask, onEditTask, onMoveTask }: TaskItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const isCompleted = task.status === 'done'
  const isOverdue = Boolean(task.dueDate && task.dueDate < getLocalDate() && !isCompleted)
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
    group: task.status,
    type: 'task',
    accept: 'task',
  })

  return (
    <>
      <Card ref={ref} className={cn('animate-in gap-0 rounded-xl border-border bg-card py-0 shadow-none fade-in slide-in-from-top-1 duration-200 ease-out transition hover:-translate-y-px hover:shadow-md focus-within:ring-2 focus-within:ring-ring motion-reduce:animate-none motion-reduce:transform-none motion-reduce:transition-none', isCompleted && 'bg-muted/30', isDragging && 'border-dashed opacity-40 shadow-none ring-0')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-2.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isCompleted}
                  onClick={() => onTaskStatusChange(task.id, isCompleted ? 'todo' : 'done')}
                  aria-label={isCompleted ? 'Reopen' : 'Mark as done'}
                  className={cn('mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:border-primary')}
                >
                  {isCompleted && (
                    <Check aria-hidden="true" className="size-3.5 animate-in fade-in zoom-in-50 duration-150 motion-reduce:animate-none" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>{isCompleted ? 'Reopen' : 'Mark as done'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h4 className={cn('line-clamp-2 min-w-0 flex-1 text-sm leading-5 font-medium wrap-anywhere', isCompleted && 'text-muted-foreground line-through')}>
            {task.title}
            {isCompleted && <span className="sr-only"> (completed)</span>}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${task.title}`}
                className="-mt-1 -mr-1 size-8 text-muted-foreground"
              >
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEditTask(task.id)}>
                <Pencil aria-hidden="true" />
                Edit task
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDuplicateTask(task.id)}>
                <Copy aria-hidden="true" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {COLUMNS.map((column) => (
                    <DropdownMenuItem
                      key={column.id}
                      disabled={column.id === task.status}
                      onSelect={() => onMoveTask(task.id, column.id)}
                    >
                      <span aria-hidden="true" className={cn('size-2 rounded-full', column.color)} />
                      {column.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleteDialogOpen(true)}>
                <Trash2 aria-hidden="true" />
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="pl-7.5">
          {task.description && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-5 whitespace-pre-line text-muted-foreground wrap-anywhere">
              {task.description}
            </p>
          )}
          <div className={cn('flex items-center justify-between gap-3 border-t border-border/60 pt-3', task.description ? 'mt-3.5' : 'mt-3')}>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className={cn('inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium capitalize', priorityStyles[task.priority])}>
                <Flag aria-hidden="true" className="size-3" />
                {task.priority}
              </span>
              {task.dueDate && (
                <span className={cn('inline-flex h-6 items-center gap-1 rounded-md bg-muted px-2 text-xs font-medium text-muted-foreground', isOverdue && 'bg-red-500/10 text-red-700 dark:text-red-300')}>
                  <Calendar aria-hidden="true" className="size-3" />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>
            <Button
              ref={handleRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move task: ${task.title}`}
              title="Drag to change status"
              className="-mr-2 size-7 shrink-0 touch-none cursor-grab text-muted-foreground/70 opacity-100 transition-opacity duration-200 active:cursor-grabbing [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100 motion-reduce:transition-none"
            >
              <GripVertical aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              “{task.title}” will be removed from the board. You can undo this immediately afterward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => onDeleteTask(task.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
