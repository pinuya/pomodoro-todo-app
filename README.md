<p align="center">
  <img src="/public/favicon.ico" width="50" alt="Logo" />
</p>
<h1 align="center">Pomodoro - ToDo</h1>

[![Site preview](/public/pomodoro.png)](https://github.com/pinuya)
Project built with [React Router](https://reactrouter.com/), [TailwindCSS](https://tailwindcss.com/), and [React](https://react.dev/). Check out the [deployed website](https://to-do-app-eight-rho-67.vercel.app/).

A Pomodoro timer with a task list attached to it: you plan how many pomodoros a task should take, pick one to work on, and the timer keeps score as you go. The goal is to keep it very simple, easy to use, and with a beautiful interface.

## Features

- **Pomodoro cycle** — Focus, short break and long break, with a long break every N rounds
- **Custom durations** — Every interval is configurable, not just the classic 25 minutes
- **Tasks tied to the timer** — Estimate pomodoros per task; finishing a focus session credits the active one
- **Alerts** — A chime when time is up (synthesised in the browser, no audio files) and optional browser notifications
- **Two languages** — Portuguese and English, resolved on the server so the first paint is already translated
- **Everything is local** — Tasks and settings live in `localStorage`; there's no account and no backend

## Install & run

Make sure you have nodejs `>=20.0.0` or higher and bun `1.1.42` or higher installed. Install dependencies with:

```bash
bun install
```

Once it's done start up a local server with:

```bash
bun dev
```

### Other scripts

```bash
bun run build      # production build
bun run start      # serve the production build
bun run typecheck  # generate route types, then run tsc
```

### Show your support

Give a ⭐ if you like this website!

Desenvolvido com ❤️ por **Tifany Nunes**.
