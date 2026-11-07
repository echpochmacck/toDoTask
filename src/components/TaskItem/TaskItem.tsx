import { useDraggable } from '@dnd-kit/react'
import { Check, GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TaskPriority } from '@/entities/task'
import type { TaskItemProps } from './types'

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

export function TaskItem({ task, onTaskStatusChange, onDeleteTask, onEditTask }: TaskItemProps) {
  const isCompleted = task.status === 'done'
  const { ref, handleRef, isDragging } = useDraggable({ id: task.id, type: 'task' })

  return (
    <Card ref={ref} className={cn('gap-0 rounded-xl border-border bg-card py-0 shadow-none transition-colors hover:border-border/80 hover:bg-card/80', isCompleted && 'bg-muted/30', isDragging && 'opacity-70 ring-2 ring-primary')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            onClick={() => onTaskStatusChange(task.id, isCompleted ? 'todo' : 'done')}
            aria-label={`${isCompleted ? 'Mark as incomplete' : 'Complete task'}: ${task.title}`}
            title={isCompleted ? 'Mark as incomplete' : 'Complete task'}
            className={cn('mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:border-primary')}
          >
            {isCompleted && <Check aria-hidden="true" className="size-3.5" />}
          </button>
          <h4 className={cn('min-w-0 flex-1 text-sm leading-5 font-semibold wrap-anywhere', isCompleted && 'text-muted-foreground line-through')}>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => onDeleteTask(task.id)}>
                <Trash2 aria-hidden="true" />
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="pl-8">
          {task.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-5 whitespace-pre-line text-muted-foreground wrap-anywhere">
              {task.description}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground capitalize">
              <span aria-hidden="true" className={cn('size-2 rounded-full', priorityStyles[task.priority])} />
              {task.priority}
            </span>
            <Button
              ref={handleRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move task: ${task.title}`}
              title="Drag to change status"
              className="-mr-2 size-7 shrink-0 touch-none cursor-grab text-muted-foreground/70 active:cursor-grabbing"
            >
              <GripVertical aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
