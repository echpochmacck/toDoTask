import { Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TaskItemProps } from './types'

export function TaskItem({ task, onDeleteTask }: TaskItemProps) {
  const isCompleted = task.status === 'done'

  return (
    <Card className="gap-0 py-0 shadow-sm">
      <CardContent className="flex items-start gap-3 p-4">
        <span
          aria-hidden="true"
          className={cn('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
            isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-input')}
        >
          {isCompleted && <Check className="size-3" />}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className={cn('text-sm font-medium wrap-anywhere', isCompleted && 'text-muted-foreground line-through')}>
            {task.title}
            {isCompleted && <span className="sr-only"> (completed)</span>}
          </h4>
          {task.description && (
            <p className="mt-2 text-xs leading-5 whitespace-pre-line text-muted-foreground wrap-anywhere">
              {task.description}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDeleteTask(task.id)}
          aria-label={`Delete task: ${task.title}`}
          title="Delete task"
          className="-mt-1 -mr-1 size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  )
}
