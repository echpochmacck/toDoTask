import { Board } from '../Board/Board'

function App() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase">
          A little focus, every day
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          My task board
        </h1>
        <p className="mt-4 text-base text-slate-500">
          Make room for what matters. One task at a time.
        </p>
      </header>
      <Board />
    </main>
  )
}

export default App
