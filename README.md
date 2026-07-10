# Quarter Calendar

A small React + Vite calendar app for planning a quarter across weekly columns. It focuses on lightweight local planning: multiple calendars, folders, editable calendar metadata, week visibility, date ranges, event editing, and automatic browser-local persistence without server storage.

## Tech Stack

- React
- Vite
- Plain CSS
- Vitest + Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Testing

Run the test suite once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The tests cover the main planning logic and user flows, including week date ranges, calendar/folder state changes, sidebar actions, week visibility, event interactions, and localStorage save/restore.

## Notes

This project automatically saves the app state to browser localStorage under a versioned key. Refreshing the page restores calendars, folders, week settings, active calendar selection, and events on the same browser/device.

Persistence is isolated in `src/lib/calendarPersistence.js` so the current localStorage implementation can later be replaced by an API or database-backed repository without spreading storage calls through UI components.
