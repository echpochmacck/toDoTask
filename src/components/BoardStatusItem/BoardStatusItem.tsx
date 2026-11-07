import { useDroppable } from '@dnd-kit/react'
import { cn } from '@/lib/utils'
import { useId, useRef, useState } from 'react'
import { Inbox, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TaskItem } from '../TaskItem/TaskItem'
import type { BoardStatusItemProps } from './types'

export function BoardStatusItem({ status, tasks, isFiltered = false, onQuickAddTask, onTaskStatusChange, onDeleteTask, onDuplicateTask, onEditTask, onMoveTask }: BoardStatusItemProps) {
  const headingId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const { ref, isDropTarget } = useDroppable({ id: status.id, accept: 'task' })

  const closeInlineForm = () => {
    setTitle('')
    setIsAdding(false)
  }

  const submitInlineTask = () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onQuickAddTask(trimmedTitle, status.id)
    closeInlineForm()
  }

  return (
    <section ref={ref} aria-labelledby={headingId} className="flex min-w-[280px] snap-start md:min-w-0">
      <Card className={cn('flex h-[60vh] min-h-[480px] w-full flex-col gap-0 rounded-xl border-border/80 py-0 shadow-none transition-colors', status.tint, isDropTarget && 'border-primary bg-primary/5 ring-2 ring-primary/30')}>
        <CardHeader className="flex flex-row items-center gap-2.5 px-4 py-3.5">
          <span aria-hidden="true" className={`size-2 rounded-full ${status.color}`} />
          <h3 id={headingId} className="text-sm font-semibold">{status.title}</h3>
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs text-muted-foreground tabular-nums">{tasks.length}</Badge>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Add task to ${status.title}`}
            title={`Add task to ${status.title}`}
            className="ml-auto size-7 text-muted-foreground"
            onClick={() => {
              setIsAdding(true)
              requestAnimationFrame(() => inputRef.current?.focus())
            }}
          >
            <Plus aria-hidden="true" />
          </Button>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
          {isAdding && (
            <form
              className="mb-3 rounded-lg border bg-card p-2"
              onSubmit={(event) => {
                event.preventDefault()
                submitInlineTask()
              }}
            >
              <Input
                ref={inputRef}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    closeInlineForm()
                  }
                }}
                placeholder="Task title"
                aria-label={`New task title for ${status.title}`}
              />
              <div className="mt-2 flex justify-end gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={closeInlineForm}>Cancel</Button>
                <Button type="submit" size="sm" disabled={!title.trim()}>Add</Button>
              </div>
            </form>
          )}
          {tasks.length > 0 ? (
            <ul className="space-y-3 pb-4">
              {tasks.map((task, index) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    index={index}
                    onTaskStatusChange={onTaskStatusChange}
                    onDeleteTask={onDeleteTask}
                    onDuplicateTask={onDuplicateTask}
                    onEditTask={onEditTask}
                    onMoveTask={onMoveTask}
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
