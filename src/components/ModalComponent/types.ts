import type { ReactNode } from 'react'

export type ModalComponentProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}
