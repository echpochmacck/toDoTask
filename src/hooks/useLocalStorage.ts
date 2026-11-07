import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type Validator<T> = (value: unknown) => value is T

export function useLocalStorage<T>(
  key: string,
  initial: T,
  validate: Validator<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const [fallback] = useState(initial)
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key)
      if (storedValue === null) return fallback

      const parsedValue: unknown = JSON.parse(storedValue)
      return validate(parsedValue) ? parsedValue : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable or full; keep the in-memory state usable.
    }
  }, [key, value])

  useEffect(() => {
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key !== key) return

      if (event.newValue === null) {
        setValue(fallback)
        return
      }

      try {
        const parsedValue: unknown = JSON.parse(event.newValue)
        setValue(validate(parsedValue) ? parsedValue : fallback)
      } catch {
        setValue(fallback)
      }
    }

    window.addEventListener('storage', syncFromStorage)
    return () => window.removeEventListener('storage', syncFromStorage)
  }, [fallback, key, validate])

  return [value, setValue]
}
