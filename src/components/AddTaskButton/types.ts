import type { MouseEventHandler } from 'react'

export type AddTaskButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}
