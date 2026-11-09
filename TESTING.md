# Testing

Run `npm run test` for the deterministic suite, `npm run test:watch` while developing, and `npm run test:coverage` for the text and HTML coverage reports. The HTML report is written to `coverage/index.html`.

The tests exercise the existing task form, board workflows, filtering, and `useLocalStorage` persistence. Task changes and reordering are currently inline event handlers rather than exported pure utilities. Pinning is not implemented.

Pointer drag and drop with `@dnd-kit/react` needs a real browser. A Playwright E2E test should drag a task within its column and into another column, assert the visible order and status, reload the page, and assert the order and status remain. Repeat with search or priority filtering active to check that hidden tasks retain their order. The jsdom suite does not claim to validate pointer dragging.
