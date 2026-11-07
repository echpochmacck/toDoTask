import { useDroppable } from '@dnd-kit/react'
import { cn } from '@/lib/utils'
import { useId } from 'react'
import { Inbox } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TaskItem } from '../TaskItem/TaskItem'
import type { BoardStatusItemProps } from './types'

export function BoardStatusItem({ status, tasks, isFiltered = false, onTaskStatusChange, onDeleteTask, onEditTask }: BoardStatusItemProps) {
  const headingId = useId()
  const { ref, isDropTarget } = useDroppable({ id: status.id, accept: 'task' })

  return (
    <section ref={ref} aria-labelledby={headingId}>
      <Card className={cn('gap-0 rounded-xl border-border/80 bg-muted/40 py-0 shadow-none transition-colors', isDropTarget && 'border-primary bg-primary/5 ring-2 ring-primary/30')}>
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
            <div className={cn('mb-4 flex items-center gap-2.5 rounded-lg border border-dashed border-border/70 bg-background/30 px-3 py-3 text-left transition-colors', isDropTarget && 'border-primary/50 bg-primary/5')}>
              <Inbox aria-hidden="true" className="size-4 shrink-0 text-muted-foreground/70" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {isFiltered ? 'No matching tasks' : status.description}
                </p>
                <p className="mt-0.5 text-xs leading-4 text-muted-foreground/80">
                  {isFiltered ? 'Try another search or priority.' : status.hint}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
