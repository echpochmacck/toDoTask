import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Task } from '@/entities/task'
import App from './App'

const storageKey = 'task-board:v1'
const savedTasks: Task[] = [
  { id: 'one', title: 'Plan launch', description: 'Draft the outline', status: 'todo', priority: 'high' },
  { id: 'two', title: 'Review design', status: 'in-progress', priority: 'low' },
  { id: 'three', title: 'Ship release', status: 'done', priority: 'medium' },
]

function seed(tasks: Task[]) {
  localStorage.setItem(storageKey, JSON.stringify(tasks))
}

function column(name: string) {
  return screen.getByRole('region', { name })
}

describe('task board workflows', () => {
  beforeEach(() => vi.stubGlobal('crypto', { randomUUID: () => 'new-id' }))

  it('starts empty, creates a task, completes it, and restores it after remount', async () => {
    const user = userEvent.setup()
    const view = render(<App />)
    expect(column('To do')).toHaveTextContent('A fresh start')
    await user.click(screen.getByRole('button', { name: /^Add task$/ }))
    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Write tests')
    await user.click(screen.getByRole('button', { name: 'Create task' }))
    expect(within(column('To do')).getByText('Write tests')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toEqual([
      expect.objectContaining({ title: 'Write tests', status: 'todo', priority: 'medium' }),
    ])
    await user.click(within(column('To do')).getByRole('checkbox', { name: 'Mark as done' }))
    expect(within(column('Done')).getByText(/Write tests/)).toBeInTheDocument()
    view.unmount()
    render(<App />)
    expect(within(column('Done')).getByText(/Write tests/)).toBeInTheDocument()
    await user.click(within(column('Done')).getByRole('checkbox', { name: 'Reopen' }))
    expect(within(column('To do')).getByText('Write tests')).toBeInTheDocument()
  })

  it('restores saved tasks including older tasks without optional properties', () => {
    seed(savedTasks)
    render(<App />)
    expect(within(column('To do')).getByText('Plan launch')).toBeInTheDocument()
    expect(within(column('To do')).getByText('Draft the outline')).toBeInTheDocument()
    expect(within(column('In progress')).getByText('Review design')).toBeInTheDocument()
    expect(within(column('Done')).getByText(/Ship release/)).toBeInTheDocument()
  })

  it.each(['{broken', '{}', '[{"id":1}]'])('handles invalid saved data: %s', (stored) => {
    localStorage.setItem(storageKey, stored)
    render(<App />)
    expect(column('To do')).toHaveTextContent('A fresh start')
    expect(screen.queryByText('Plan launch')).not.toBeInTheDocument()
  })

  it('searches title and description without changing stored tasks', async () => {
    seed(savedTasks)
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: 'Search tasks' }), 'OUTLINE')
    expect(within(column('To do')).getByText('Plan launch')).toBeInTheDocument()
    expect(screen.queryByText('Review design')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Kanban task board' })).toHaveTextContent('Showing 1 of 3 tasks')
    await user.clear(screen.getByRole('searchbox', { name: 'Search tasks' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search tasks' }), 'missing')
    expect(screen.getByText('Nothing found')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Review design')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toEqual(savedTasks)
  })

  it('quick adds to the selected column and keeps an empty saved list empty', async () => {
    seed([])
    const user = userEvent.setup()
    const view = render(<App />)
    expect(screen.queryByText('Plan the week')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add task to Backlog' }))
    await user.type(screen.getByRole('textbox', { name: 'New task title for Backlog' }), '  Idea  ')
    await user.click(within(column('Backlog')).getByRole('button', { name: /^Add$/ }))
    expect(within(column('Backlog')).getByText('Idea')).toBeInTheDocument()
    view.unmount()
    render(<App />)
    expect(within(column('Backlog')).getByText('Idea')).toBeInTheDocument()
  })

  it('edits a task through its actions menu and filters by priority', async () => {
    seed(savedTasks)
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Actions for Plan launch' }))
    await user.click(screen.getByRole('menuitem', { name: 'Edit task' }))
    expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('Plan launch')
    await user.clear(screen.getByRole('textbox', { name: /title/i }))
    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Plan rollout')
    await user.click(screen.getByRole('combobox', { name: 'Priority' }))
    await user.click(screen.getByRole('option', { name: 'Low' }))
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(within(column('To do')).getByText('Plan rollout')).toBeInTheDocument()
    expect(screen.queryByText('Plan launch')).not.toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Filter by priority' }))
    await user.click(screen.getByRole('option', { name: 'Low priority' }))
    expect(screen.getByText('Plan rollout')).toBeInTheDocument()
    expect(screen.getByText('Review design')).toBeInTheDocument()
    expect(screen.queryByText('Ship release')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(within(column('Done')).getByText(/Ship release/)).toBeInTheDocument()
  })

  it('deletes a task only after confirmation', async () => {
    seed(savedTasks)
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Actions for Review design' }))
    await user.click(screen.getByRole('menuitem', { name: 'Delete task' }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Review design')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Actions for Review design' }))
    await user.click(screen.getByRole('menuitem', { name: 'Delete task' }))
    await user.click(screen.getByRole('button', { name: /^Delete$/ }))
    expect(screen.queryByText('Review design')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toEqual([savedTasks[0], savedTasks[2]])
  })

  it('duplicates a task beside the original', async () => {
    seed(savedTasks)
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Actions for Plan launch' }))
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }))
    expect(within(column('To do')).getByText('Plan launch (copy)')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toEqual([
      savedTasks[0],
      { ...savedTasks[0], id: 'new-id', title: 'Plan launch (copy)' },
      savedTasks[1], savedTasks[2],
    ])
  })

  it('moves a task above medium and low tasks when edited to high priority', async () => {
    seed([
      { id: 'medium', title: 'Existing medium', status: 'todo', priority: 'medium' },
      { id: 'low', title: 'Existing low', status: 'todo', priority: 'low' },
    ])
    const user = userEvent.setup()
    const view = render(<App />)
    await user.click(screen.getByRole('button', { name: /^Add task$/ }))
    await user.type(screen.getByRole('textbox', { name: /title/i }), 'New task')
    await user.click(screen.getByRole('button', { name: 'Create task' }))
    expect(within(column('To do')).getAllByRole('heading', { level: 4 }).map((item) => item.textContent)).toEqual([
      'Existing medium', 'New task', 'Existing low',
    ])
    await user.click(screen.getByRole('button', { name: 'Actions for New task' }))
    await user.click(screen.getByRole('menuitem', { name: 'Edit task' }))
    await user.click(screen.getByRole('combobox', { name: 'Priority' }))
    await user.click(screen.getByRole('option', { name: 'High' }))
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(within(column('To do')).getAllByRole('heading', { level: 4 }).map((item) => item.textContent)).toEqual([
      'New task', 'Existing medium', 'Existing low',
    ])
    view.unmount()
    render(<App />)
    expect(within(column('To do')).getAllByRole('heading', { level: 4 }).map((item) => item.textContent)).toEqual([
      'New task', 'Existing medium', 'Existing low',
    ])
  })

  it('shows previously saved tasks in priority order by default', () => {
    seed([
      { id: 'medium', title: 'Existing medium', status: 'todo', priority: 'medium' },
      { id: 'high', title: 'Existing high', status: 'todo', priority: 'high' },
      { id: 'low', title: 'Existing low', status: 'todo', priority: 'low' },
    ])
    render(<App />)
    expect(within(column('To do')).getAllByRole('heading', { level: 4 }).map((item) => item.textContent)).toEqual([
      'Existing high', 'Existing medium', 'Existing low',
    ])
  })

  it('keeps a saved manual order after remount', () => {
    seed([
      { id: 'medium', title: 'Dragged medium', status: 'todo', priority: 'medium' },
      { id: 'high', title: 'Dragged high', status: 'todo', priority: 'high' },
    ])
    localStorage.setItem('task-board:manual-order:v1', 'true')
    const view = render(<App />)
    expect(within(column('To do')).getAllByRole('heading', { level: 4 }).map((item) => item.textContent)).toEqual([
      'Dragged medium', 'Dragged high',
    ])
    view.unmount()
    render(<App />)
    expect(within(column('To do')).getAllByRole('heading', { level: 4 }).map((item) => item.textContent)).toEqual([
      'Dragged medium', 'Dragged high',
    ])
  })
})
