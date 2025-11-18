# Google Calendar Clone — Project Overview

Purpose
- React calendar app supporting Month/Week/Day views, event creation, and keyboard shortcuts.

How to run
- npm install
- npm start
- Open http://localhost:3000

High-level architecture
- React app with functional components and Context API for global state.
- Components:
  - CalendarHeader — top controls (navigate, view mode)
  - Sidebar — event legend / create button
  - Month — month grid view
  - WeekView — week grid
  - DayView — single day view
  - EventModal — create/edit events
- Context: GlobalContext provides monthIndex, selected day, viewMode, showEventModal, setters.
- Utils: getMonth builds the month matrix for rendering.

Key files
- src/App.js — wires everything, listens for keyboard shortcuts, chooses view.
- src/context/GlobalContext.js — global state + provider.
- src/components/* — UI components listed above.
- src/util.js — date helpers (getMonth, etc.)

Keyboard shortcuts (as implemented in App.js)
- C — open create event modal
- ESC — close modal
- T — go to today
- M / W / D — switch to Month / Week / Day views

Talking points for interview
- State management: Why Context vs Redux (use Context for small-to-medium app; Redux for complex global state + middleware).
- Componentization: separation of concerns (header, views, modal).
- Data flow: events stored in context (or future backend) → passed to views → EventModal updates context.
- Accessibility & UX: keyboard handlers skip inputs; consider ARIA and focus management in EventModal.
- Performance: month grid rendering — memoize cells, avoid re-rendering whole calendar when small changes occur.
- Extensibility: adding recurring events, backend sync (REST or GraphQL), authentication.

Demo plan (short)
1. Start app.
2. Show switching views (M/W/D keys).
3. Create event via modal (C key), show it appears.
4. Navigate months and go to Today (T key).
5. Briefly open key components in editor and explain data flow.

Common interview questions to prepare
- Explain how getMonth works and its complexity.
- How would you add event persistence (server + sync/conflict handling)?
- How to implement recurring events?
- How to optimize rendering large calendars?

Notes
- Use this file as talking notes; open App.js and GlobalContext during interview to show actual implementations.
