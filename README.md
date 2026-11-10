# My Task Board

A Kanban-style task manager built as an AI-assisted web development take-home assignment. The app focuses on a straightforward workflow, accessible controls, and code that is easy to maintain.

## Live demo

- [Live Demo — add URL after deployment]
- [GitHub repository](https://github.com/echpochmacck/toDoTask)

## Features

- Organize tasks across Backlog, To do, In progress, and Done columns.
- Create tasks through a full form or a quick-add field; edit, duplicate, complete, reopen, and delete tasks. Deletions can be undone immediately.
- Set a description, due date, and low, medium, or high priority. Columns display tasks by priority by default; drag and drop enables a saved manual order and moves tasks between columns.
- Search titles and descriptions, filter by priority, and track completion progress.
- Switch between light, dark, and system themes. The board adapts to smaller screens.
- Keep task data in browser `localStorage`. It is not synchronized across devices.

## Tech stack

| Technology | Role |
| --- | --- |
| React, TypeScript, Vite | UI, types, and development/build tooling |
| Tailwind CSS, shadcn/ui, Radix UI | Styling and accessible interface primitives |
| `@dnd-kit/react` | Drag and drop between columns and within a column |
| Vitest, React Testing Library, user-event, jsdom | Automated component, workflow, and persistence tests |

## Getting started

```bash
git clone https://github.com/echpochmacck/toDoTask.git
cd toDoTask
npm ci
npm run dev
```

Open the local URL printed by Vite. To create a production build, run:

```bash
npm run build
```

The standard build uses root-relative asset paths for Cloudflare Pages. Set its build command to `npm run build` and output directory to `dist`. GitHub Pages uses `npm run build -- --mode github` in the deployment workflow so assets load under `/toDoTask/`.

## Testing

```bash
npm run test           # run the suite once
npm run test:watch     # rerun tests while editing
npm run test:coverage  # generate text and HTML coverage reports
npm run lint
```

The tests cover task creation and editing, board operations, search and priority filtering, ordering, and `localStorage` recovery and persistence. Browser pointer dragging still needs an end-to-end test; see [TESTING.md](TESTING.md).

## Project structure

```text
src/
├── components/    # Board, task form and cards, search, theme control, UI primitives
├── entities/task/ # Task types and priority ordering
├── hooks/         # localStorage state and synchronization
├── test/          # Shared test setup
├── index.css      # Tailwind and theme styles
└── main.tsx       # React entry point
```

## AI-assisted development

The developer's primary commercial experience is with Vue 3 and TypeScript. React was chosen for this assignment to explore a less familiar framework with OpenAI Codex. The workflow combines requirements analysis and planning, Codex-assisted generation of React components and application logic, manual code inspection and iterative refinement, UI/UX improvements, debugging, and automated testing. Linting and the production build support final validation. Deployment is pending a live URL.

## Limitations

There is no backend or authentication. Tasks live in the current browser's `localStorage`, so they are not synchronized between browsers or devices and can be lost if browser data is cleared.
