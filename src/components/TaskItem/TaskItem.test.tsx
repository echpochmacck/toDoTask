import { render, screen, within } from '@testing-library/react'
import { DragDropProvider, useDragDropManager } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { describe, expect, it, vi } from 'vitest'
import { TaskItem } from './TaskItem'

describe('task card sortable element', () => {
  it('registers the keyed list item so DOM sorting cannot detach its card', () => {
    const managerRef: { current: ReturnType<typeof useDragDropManager> } = { current: null }
    function Probe() {
      managerRef.current = useDragDropManager()
      return null
    }

    const noop = vi.fn()
    render(
      <DragDropProvider>
        <Probe />
        <ul>
          <TaskItem
            task={{ id: 'a', title: 'First', status: 'backlog', priority: 'medium' }}
            index={0}
            onTaskStatusChange={noop}
            onDeleteTask={noop}
            onDuplicateTask={noop}
            onEditTask={noop}
            onMoveTask={noop}
          />
          <TaskItem
            task={{ id: 'b', title: 'Second', status: 'backlog', priority: 'medium' }}
            index={1}
            onTaskStatusChange={noop}
            onDeleteTask={noop}
            onDuplicateTask={noop}
            onEditTask={noop}
            onMoveTask={noop}
          />
        </ul>
      </DragDropProvider>,
    )

    const items = screen.getAllByRole('listitem')
    for (const [index, id] of ['a', 'b'].entries()) {
      const registered = managerRef.current?.registry.droppables.get(id)
      expect(registered && isSortable(registered)).toBe(true)
      if (!registered || !isSortable(registered)) throw new Error('Task was not registered as sortable')
      expect(registered.sortable.element).toBe(items[index])
    }

    items[1].insertAdjacentElement('afterend', items[0])
    expect(within(items[0]).getByText('First')).toBeInTheDocument()
    expect(within(items[1]).getByText('Second')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    items[1].insertAdjacentElement('beforebegin', items[0])
  })
})
