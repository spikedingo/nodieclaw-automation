# ✅ Checkmate

A production-ready todo app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

![Checkmate Screenshot](https://via.placeholder.com/640x400/6366F1/ffffff?text=Checkmate)

## Features

- ✅ **Create tasks** — Type and press Enter, newest first
- ☑️ **Complete tasks** — Checkbox with strikethrough, fully toggleable
- 🗑️ **Delete tasks** — Trash icon (hover on desktop, always visible on mobile)
- 💾 **Persisted** — localStorage, survives page refresh
- 🔍 **Filter tabs** — All / Active / Completed (saved to localStorage)
- ✏️ **Inline edit** — Double-click any task to edit it
- 🎨 **Priority** — High / Medium / Low with color-coded badges
- 📅 **Due dates** — Human-readable ("Today", "Tomorrow", "Mar 28"), overdue highlighted red
- 🧹 **Clear completed** — One click to clean up done items
- 🔢 **Task count** — Live "X tasks left" counter
- ⌨️ **Keyboard shortcuts** — `/` to focus input, `Enter` to submit, `Escape` to cancel
- 🌙 **Dark mode** — Auto from system preference, toggle with sun/moon button

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| localStorage | Persistence (no backend) |

## Data Model

```ts
interface TodoItem {
  id: string;           // crypto.randomUUID()
  text: string;         // max 500 chars
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null; // "YYYY-MM-DD"
  createdAt: string;    // ISO datetime
  updatedAt: string;    // ISO datetime
}
```

localStorage keys: `checkmate_todos`, `checkmate_prefs`, `checkmate_theme`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## License

MIT
