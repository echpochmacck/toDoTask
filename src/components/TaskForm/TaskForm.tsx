import { useId, useRef, useState } from 'react'
import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { TaskFormProps, TaskFormValues } from './types'

const statuses = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
] as const satisfies readonly { value: TaskFormValues['status']; label: string }[]

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const satisfies readonly { value: TaskFormValues['priority']; label: string }[]

export function TaskForm({ initialValues, submitLabel = 'Create task', onSubmit, onCancel }: TaskFormProps) {
  const id = useId()
  const titleRef = useRef<HTMLInputElement>(null)
  const [shouldValidateTitle, setShouldValidateTitle] = useState(false)
  const [values, setValues] = useState<TaskFormValues>(() => ({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    status: initialValues?.status ?? 'todo',
    priority: initialValues?.priority ?? 'medium',
  }))
  const isTitleValid = Boolean(values.title.trim())
  const titleError = shouldValidateTitle && !isTitleValid ? 'Please enter a task title.' : undefined

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        const title = values.title.trim()
        setShouldValidateTitle(true)
        if (!title) {
          titleRef.current?.focus()
          return
        }
        onSubmit({ ...values, title, description: values.description?.trim() || undefined })
      }}
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-title`}>Title <span className="text-destructive" aria-hidden="true">*</span></Label>
        <Input
          id={`${id}-title`}
          name="title"
          ref={titleRef}
          aria-required="true"
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? `${id}-title-error` : undefined}
          placeholder="e.g. Prepare project brief"
          value={values.title}
          className="h-9"
          onChange={(event) => {
            setShouldValidateTitle(true)
            setValues({ ...values, title: event.target.value })
          }}
        />
        <div aria-live="polite" aria-atomic="true">
          {titleError && (
            <p id={`${id}-title-error`} className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
              {titleError}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-description`}>Description (optional)</Label>
        <Textarea
          id={`${id}-description`}
          name="description"
          rows={4}
          placeholder="Add any useful context or notes…"
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${id}-status`}>Status</Label>
          <Select
            name="status"
            value={values.status}
            onValueChange={(value) => {
              const status = statuses.find((option) => option.value === value)?.value
              if (status) setValues({ ...values, status })
            }}
          >
            <SelectTrigger id={`${id}-status`} className="h-9 w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-priority`}>Priority</Label>
          <Select
            name="priority"
            value={values.priority}
            onValueChange={(value) => {
              const priority = priorities.find((option) => option.value === value)?.value
              if (priority) setValues({ ...values, priority })
            }}
          >
            <SelectTrigger id={`${id}-priority`} className="h-9 w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!isTitleValid}>{submitLabel}</Button>
      </div>
    </form>
  )
}
