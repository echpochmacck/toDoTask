import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

describe('useLocalStorage', () => {
  it('saves updates and restores them on a new mount', () => {
    const first = renderHook(() => useLocalStorage('items', [], isStringArray))
    act(() => first.result.current[1](['first', 'second']))
    expect(JSON.parse(localStorage.getItem('items') ?? 'null')).toEqual(['first', 'second'])
    first.unmount()
    const second = renderHook(() => useLocalStorage('items', [], isStringArray))
    expect(second.result.current[0]).toEqual(['first', 'second'])
  })

  it('ignores malformed or structurally invalid saved values', () => {
    localStorage.setItem('items', '{broken')
    const malformed = renderHook(() => useLocalStorage('items', [], isStringArray))
    expect(malformed.result.current[0]).toEqual([])
    malformed.unmount()
    localStorage.setItem('items', '[1, 2]')
    const invalid = renderHook(() => useLocalStorage('items', [], isStringArray))
    expect(invalid.result.current[0]).toEqual([])
  })

  it('keeps in-memory updates usable if storage writes fail', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
    const { result } = renderHook(() => useLocalStorage('items', [], isStringArray))
    act(() => result.current[1](['still available']))
    expect(result.current[0]).toEqual(['still available'])
  })

  it('accepts valid updates from another tab and rejects invalid ones', () => {
    const { result } = renderHook(() => useLocalStorage('items', [], isStringArray))
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: '["ignored"]' })))
    expect(result.current[0]).toEqual([])
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'items', newValue: '["remote"]' })))
    expect(result.current[0]).toEqual(['remote'])
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'items', newValue: '{broken' })))
    expect(result.current[0]).toEqual([])
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'items', newValue: '[1]' })))
    expect(result.current[0]).toEqual([])
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'items', newValue: null })))
    expect(result.current[0]).toEqual([])
  })
})
