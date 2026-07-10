# Quarter Calendar

A small React + Vite calendar app for planning a quarter across weekly columns. It focuses on lightweight browser-session planning: multiple calendars, folders, editable calendar metadata, week visibility, date ranges, and event editing without server storage or local persistence.

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

The tests cover the main planning logic and user flows, including week date ranges, calendar/folder state changes, sidebar actions, week visibility, and event interactions.

## Notes

This project intentionally keeps state in React only. Refreshing the page resets calendars, folders, week settings, and events to the initial in-memory data.
