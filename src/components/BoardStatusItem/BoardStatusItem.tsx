import { useDroppable } from '@dnd-kit/react'
import { cn } from '@/lib/utils'
import { useId } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TaskItem } from '../TaskItem/TaskItem'
import type { BoardStatusItemProps } from './types'

export function BoardStatusItem({ status, tasks, onTaskStatusChange, onDeleteTask, onEditTask }: BoardStatusItemProps) {
  const headingId = useId()
  const { ref, isDropTarget } = useDroppable({ id: status.id, accept: 'task' })

  return (
    <section ref={ref} aria-labelledby={headingId}>
      <Card className={cn('min-h-44 gap-0 rounded-xl border-border/80 bg-muted/40 py-0 shadow-none transition-colors', isDropTarget && 'border-primary bg-primary/5 ring-2 ring-primary/30')}>
        <CardHeader className="flex flex-row items-center gap-2.5 px-4 py-3.5">
          <span aria-hidden="true" className={`size-2 rounded-full ${status.dotColor}`} />
          <h3 id={headingId} className="text-sm font-semibold">{status.title}</h3>
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs text-muted-foreground">{tasks.length}</Badge>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {tasks.length > 0 ? (
            <ul className="space-y-3 pb-4">
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    onTaskStatusChange={onTaskStatusChange}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-border bg-background/50 px-4 py-5 text-center">
              <p className="text-sm font-medium">{status.description}</p>
              <p className="mx-auto mt-1 max-w-48 text-xs leading-4 text-muted-foreground">{status.hint}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
