import { describe, expect, it } from 'vitest'
import type { Task, TaskStatus } from './types'
import { moveTaskToIndex } from './moveTaskToIndex'

const initial: Task[] = [
  { id: 'a', title: 'A', status: 'backlog', priority: 'low' },
  { id: 'b', title: 'B', status: 'backlog', priority: 'high' },
  { id: 'c', title: 'C', status: 'todo', priority: 'medium' },
]

function ids(tasks: Task[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status).map((task) => task.id)
}

function expectConsistent(tasks: Task[]) {
  expect(tasks).toHaveLength(initial.length)
  expect(new Set(tasks.map((task) => task.id)).size).toBe(initial.length)
  expect([...tasks.map((task) => task.id)].sort()).toEqual(['a', 'b', 'c'])
  expect(['backlog', 'todo', 'in-progress', 'done'].reduce(
    (count, status) => count + tasks.filter((task) => task.status === status).length, 0,
  )).toBe(tasks.length)
}

describe('moveTaskToIndex', () => {
  it('moves tasks between columns in both directions repeatedly without losing IDs', () => {
    let tasks = initial
    for (let attempt = 0; attempt < 3; attempt++) {
      tasks = moveTaskToIndex(tasks, 'a', 'todo', 0)
      expect(ids(tasks, 'backlog')).toEqual(['b'])
      expect(ids(tasks, 'todo')).toEqual(['a', 'c'])
      expectConsistent(tasks)
      tasks = moveTaskToIndex(tasks, 'a', 'backlog', 1)
      expect(ids(tasks, 'backlog')).toEqual(['b', 'a'])
      expect(ids(tasks, 'todo')).toEqual(['c'])
      expectConsistent(tasks)
    }
  })

  it('reorders within a column and preserves manual order through subsequent moves', () => {
    let tasks = moveTaskToIndex(initial, 'a', 'backlog', 1)
    expect(ids(tasks, 'backlog')).toEqual(['b', 'a'])
    tasks = moveTaskToIndex(tasks, 'c', 'backlog', 1)
    expect(ids(tasks, 'backlog')).toEqual(['b', 'c', 'a'])
    tasks = moveTaskToIndex(tasks, 'c', 'todo', 0)
    expect(ids(tasks, 'backlog')).toEqual(['b', 'a'])
    expect(ids(tasks, 'todo')).toEqual(['c'])
    expectConsistent(tasks)
  })

  it('moves multiple tasks into an empty column and back without duplicates', () => {
    let tasks = moveTaskToIndex(initial, 'a', 'in-progress', 0)
    tasks = moveTaskToIndex(tasks, 'b', 'in-progress', 1)
    expect(ids(tasks, 'in-progress')).toEqual(['a', 'b'])
    tasks = moveTaskToIndex(tasks, 'a', 'backlog', 0)
    tasks = moveTaskToIndex(tasks, 'b', 'backlog', 1)
    expect(ids(tasks, 'backlog')).toEqual(['a', 'b'])
    expect(ids(tasks, 'in-progress')).toEqual([])
    expectConsistent(tasks)
  })
})
