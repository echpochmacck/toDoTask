import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AddTaskButtonProps } from './types'

export function AddTaskButton({ onClick, disabled = false }: AddTaskButtonProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      <Plus aria-hidden="true" />
      Add task
    </Button>
  )
}
