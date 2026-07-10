# Quarter Calendar Design System

## 1. Direction

Quarter Calendar is a calm desktop planning surface: editable editorial header, paper-like week columns, compact event cards, and a slightly warmer emphasis for Finals Week. The interface should feel focused and personal rather than like a generic dashboard.

## 2. Tokens

- Background: `--color-page`, `--color-surface`, `--color-surface-strong`
- Text: `--color-text`, `--color-muted`, `--color-soft`
- Accent: `--color-accent`, `--color-accent-strong`, `--color-danger`, `--color-danger-soft`, `--color-finals`, `--color-finals-border`
- Border: `--color-border`, `--color-border-strong`
- Shadow: `--shadow-card`, `--shadow-column`
- Radius: `--radius-card`, `--radius-column`, `--radius-pill`
- Spacing: 4px base scale, using 8px, 12px, 16px, 20px, 24px, 32px, and 40px steps.

## 3. Typography

- Font stack: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
- Page title: large, tight, 700 weight.
- Quarter label and metadata: small uppercase label treatment.
- Week titles: compact, 700 weight.
- Event cards: concise title/body hierarchy.

## 4. Layout

- App shell uses full viewport height with a left sidebar and a main content region.
- Sidebar lists folders and their calendars, plus an Unfiled group for calendars without a folder. It includes New folder and New calendar buttons, plus compact overflow action menus for existing folders and calendars.
- Selecting a calendar sets `activeCalendarId`; the main quarterly calendar shows only events for that calendar.
- Calendar title, subtitle, week visibility, and Week 1 Monday are stored on each calendar object and restored when switching active calendars.
- The calendar meta row includes a compact Week 1 Monday month/day picker; the active calendar's selected browser-session state drives computed weekly date ranges.
- App main contains the editable header and the scrollable calendar stage.
- Calendar track is a horizontal flex row with 12 fixed-width week columns.
- Columns never shrink below their minimum width; narrow viewports navigate via horizontal scroll.
- Week visibility is opened from a header button and shown in a modal popup, not as a permanent column.

## 5. Components

- App header: editable title and subtitle fields with short supporting copy.
- Sidebar: folders, calendars (with optional folderId), unfiled calendars, active calendar selection, create buttons, and overflow menus for rename, move, and delete actions.
- Week visibility: header button opens a modal popup listing all weeks with checkboxes and a visible-count summary.
- Week column: title row, add button, inline add form ordered Title, Note, Day, Start, End, and stacked event cards.
- Week date range: optional Monday-Sunday date text appears directly below each week title once Week 1 Monday is selected.
- Event card: small block with day label and HH:MM - HH:MM time range on the right, title, optional note, copy/edit controls, delete control, and an edit form matching the add form order.
- Event clipboard: Copy stores event contents in memory; Paste in a week column creates a new event for the active calendar with a fresh id.
- Finals column: same structure as a week column with warmer tint and stronger border.
- Events sort by day of week within a week (미선택 first, then MON through SUN).
- Each event carries `calendarId`; each calendar may carry an optional `folderId`, `title`, `subtitle`, `visibleWeekIds`, and `week1Monday`.

## 6. States

- Add buttons open a compact controlled form for the selected week.
- Event cards can switch between read and edit states.
- Delete removes an event from browser state only.
- Sidebar overflow menus rename folders/calendars, move calendars between folders, or delete items in browser state only.
- Week visibility checkboxes hide or show week columns without removing their events.
- Week 1 Monday month/day selection is stored per calendar and computes visible date ranges in browser state only.

## 7. Constraints

- No UI libraries.
- No localStorage, export/import, GitHub Actions, or real event creation in this MVP.
- State is browser-session only and managed with React `useState`.
- All visible layout and color decisions should map to the CSS custom properties above.
