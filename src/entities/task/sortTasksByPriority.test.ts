import { describe, expect, it } from 'vitest'
import type { Task } from './types'
import { sortTasksByPriority } from './sortTasksByPriority'

describe('sortTasksByPriority', () => {
  it('orders high, medium, low within one column and keeps ties stable', () => {
    const tasks: Task[] = [
      { id: 'medium-one', title: 'First medium', status: 'todo', priority: 'medium' },
      { id: 'other', title: 'Other column', status: 'done', priority: 'low' },
      { id: 'low', title: 'Low', status: 'todo', priority: 'low' },
      { id: 'high', title: 'High', status: 'todo', priority: 'high' },
      { id: 'medium-two', title: 'Second medium', status: 'todo', priority: 'medium' },
    ]

    const sorted = sortTasksByPriority(tasks, 'todo')
    expect(sorted.map((task) => task.id)).toEqual(['high', 'other', 'medium-one', 'medium-two', 'low'])
    expect(tasks.map((task) => task.id)).toEqual(['medium-one', 'other', 'low', 'high', 'medium-two'])
    expect(sorted[1]).toBe(tasks[1])
    expect(sortTasksByPriority([], 'todo')).toEqual([])
  })
})
