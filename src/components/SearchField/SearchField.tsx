import { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { SearchFieldProps } from './types'

export function SearchField({
  value,
  onChange,
  placeholder = 'Search tasks...',
  ariaLabel = 'Search tasks',
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const clearSearch = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full sm:w-64">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.preventDefault()
            clearSearch()
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pr-9 pl-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          title="Clear search"
          className="absolute top-1/2 right-0.5 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </div>
  )
}
