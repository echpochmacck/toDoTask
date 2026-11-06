import { useDroppable } from '@dnd-kit/react'
import { cn } from '@/lib/utils'
import { useId } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TaskItem } from '../TaskItem/TaskItem'
import type { BoardStatusItemProps } from './types'

export function BoardStatusItem({ status, tasks, onDeleteTask }: BoardStatusItemProps) {
  const headingId = useId()
  const { ref, isDropTarget } = useDroppable({ id: status.id, accept: 'task' })

  return (
    <section ref={ref} aria-labelledby={headingId}>
      <Card className={cn('h-full min-h-72 gap-0 bg-muted/60 py-4 shadow-none md:min-h-96', isDropTarget && 'bg-primary/5 ring-2 ring-primary')}>
        <CardHeader className="flex flex-row items-center gap-2.5 px-5 py-2">
          <span aria-hidden="true" className={`size-2 rounded-full ${status.dotColor}`} />
          <h3 id={headingId} className="text-sm font-semibold">{status.title}</h3>
          <Badge variant="secondary" className="ml-auto bg-background text-muted-foreground">{tasks.length}</Badge>
        </CardHeader>
        <CardContent className="px-4">
          {tasks.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskItem task={task} onDeleteTask={onDeleteTask} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed px-5 py-10 text-center">
              <p className="text-sm font-medium">{status.description}</p>
              <p className="mx-auto mt-2 max-w-48 text-xs leading-5 text-muted-foreground">{status.hint}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
