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
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
] as const satisfies readonly { value: TaskFormValues['status']; label: string }[]

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const id = useId()
  const titleRef = useRef<HTMLInputElement>(null)
  const [shouldValidateTitle, setShouldValidateTitle] = useState(false)
  const [values, setValues] = useState<TaskFormValues>({ title: '', description: '', status: 'todo' })
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
          value={values.title}
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
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </div>
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
          <SelectTrigger id={`${id}-status`} className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!isTitleValid}>Create task</Button>
      </div>
    </form>
  )
}
