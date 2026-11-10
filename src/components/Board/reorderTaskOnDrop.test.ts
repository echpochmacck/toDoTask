import { describe, expect, it } from 'vitest'
import type { Task, TaskStatus } from '@/entities/task'
import { reorderTaskOnDrop } from './reorderTaskOnDrop'

const tasks: Task[] = [
  { id: 'a', title: 'A', status: 'backlog', priority: 'medium' },
  { id: 'b', title: 'B', status: 'backlog', priority: 'medium' },
  { id: 'c', title: 'C', status: 'todo', priority: 'medium' },
]

function ids(items: Task[], status: TaskStatus) {
  return items.filter((item) => item.status === status).map((item) => item.id)
}

function verify(items: Task[]) {
  expect(items).toHaveLength(3)
  expect(new Set(items.map((item) => item.id))).toEqual(new Set(['a', 'b', 'c']))
  for (const status of ['backlog', 'todo', 'in-progress', 'done'] as const) {
    expect(ids(items, status)).toHaveLength(items.filter((item) => item.status === status).length)
  }
}

describe('reorderTaskOnDrop', () => {
  it('moves between Backlog and To do repeatedly, including an empty destination', () => {
    let current = tasks
    for (let attempt = 0; attempt < 3; attempt++) {
      current = reorderTaskOnDrop(current, 'a', 'todo')!
      expect(ids(current, 'todo')).toEqual(['c', 'a'])
      verify(current)
      current = reorderTaskOnDrop(current, 'a', 'backlog')!
      expect(ids(current, 'backlog')).toEqual(['b', 'a'])
      verify(current)
    }

    current = reorderTaskOnDrop(current, 'b', 'in-progress')!
    expect(ids(current, 'in-progress')).toEqual(['b'])
    verify(current)
  })

  it('places a task immediately after a lower target without skipping the next card', () => {
    const moved = reorderTaskOnDrop(tasks, 'a', 'b')!
    expect(ids(moved, 'backlog')).toEqual(['b', 'a'])
    expect(reorderTaskOnDrop(moved, 'a', 'b')).toEqual(tasks)
    verify(moved)
  })

  it('uses IDs when filtered-out cards precede the dragged and target cards', () => {
    const filteredTasks: Task[] = [
      { id: 'hidden', title: 'Hidden', status: 'backlog', priority: 'low' },
      ...tasks,
    ]
    const moved = reorderTaskOnDrop(filteredTasks, 'a', 'b')!
    expect(ids(moved, 'backlog')).toEqual(['hidden', 'b', 'a'])
    expect(moved.map((item) => item.id)).toEqual(['hidden', 'b', 'a', 'c'])
  })

  it('ignores unchanged and invalid drops without changing task identity', () => {
    expect(reorderTaskOnDrop(tasks, 'a', 'a')).toBeNull()
    expect(reorderTaskOnDrop(tasks, 'missing', 'todo')).toBeNull()
    expect(tasks.map((item) => item.id)).toEqual(['a', 'b', 'c'])
  })
})
