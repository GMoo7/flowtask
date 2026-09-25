# FlowTask — SaaS landing page + project dashboard (demo)

A fictional project-management product built as a portfolio piece. It pairs a marketing website with a working application interface.

**Live demo:** https://gmoo7.github.io/flowtask/ — or jump straight into the app: https://gmoo7.github.io/flowtask/#/app

## Public website
- **Home** — hero with a live, draggable mini board; features; how it works; pricing with monthly/yearly toggle; testimonials; FAQ; CTA
- **Pricing** — Free, Pro ($12/user/mo) and Business ($29/user/mo) tiers plus a feature comparison table *(demo pricing)*
- **Log in / Sign up** — validated authentication-style screens (demo credentials pre-filled)

## Dashboard
- **Overview** — greeting, KPI tiles, your tasks, weekly completion chart, project progress
- **Projects** — grid/list views, create a project
- **Project board** — kanban with drag-and-drop between columns, assignee filter, keyboard-friendly "move" menu, add/edit/delete tasks
- **My tasks** — search, filter by assignee/status/priority, sort, tick tasks off
- **Team** — members, status, workload bars, invite by email
- **Analytics** — created vs completed line chart, status donut, per-person bar chart, date-range switch
- **Notifications** — unread badge, popover, mark all as read
- **Settings** — profile, light/dark theme, notification switches, reset demo data
- **Global search** — finds projects and tasks from the top bar

All data is sample data saved to `localStorage`, so changes survive a refresh. Settings → **Reset demo data** restores it.

## Stack
- **Vue 3** (vendored in `/vendor`, no CDN or build step)
- Small hash router (`js/router.js`) and a reactive store with persistence (`js/store.js`)
- Hand-written SVG chart components (`js/charts.js`) — no chart library
- One CSS file with light and dark themes

_FlowTask, its customers and pricing are fictional._
