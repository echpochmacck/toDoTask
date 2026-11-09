import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  it('requires a nonblank title and trims submitted text', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    const submit = screen.getByRole('button', { name: 'Create task' })
    expect(submit).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: /title/i }), '   ')
    expect(screen.getByText('Please enter a task title.')).toBeInTheDocument()
    expect(submit).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: /title/i }), '  Prepare brief  ')
    await user.type(screen.getByRole('textbox', { name: /description/i }), '  Notes  ')
    await user.click(submit)
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Prepare brief', description: 'Notes', status: 'todo', priority: 'medium',
    }))
  })

  it('initializes editing fields and sends changed values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm initialValues={{ title: 'Original', status: 'backlog', priority: 'low' }} submitLabel="Save changes" onSubmit={onSubmit} onCancel={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('Original')
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent('Backlog')
    expect(screen.getByRole('combobox', { name: 'Priority' })).toHaveTextContent('Low')
    await user.clear(screen.getByRole('textbox', { name: /title/i }))
    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Revised')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Revised', status: 'backlog', priority: 'low' }))
  })

  it('cancels without submitting', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)
    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Discard me')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
