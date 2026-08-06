export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

export interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

const TODOS_KEY = "pomodoro_todos";
const SETTINGS_KEY = "pomodoro_settings";
const ACTIVE_TASK_KEY = "pomodoro_active_task";

export const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

export const DURATION_LIMITS = { min: 1, max: 180 } as const;
export const INTERVAL_LIMITS = { min: 2, max: 12 } as const;
export const ESTIMATE_LIMITS = { min: 1, max: 99 } as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage:`, error);
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage:`, error);
  }
}

function migrateTodo(raw: unknown): Todo | null {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Partial<Todo>;
  if (typeof value.id !== "string" || typeof value.text !== "string") {
    return null;
  }

  const estimated = Number(value.estimatedPomodoros);
  const completed = Number(value.completedPomodoros);

  return {
    id: value.id,
    text: value.text,
    completed: Boolean(value.completed),
    createdAt:
      typeof value.createdAt === "number" ? value.createdAt : Date.now(),
    estimatedPomodoros: Number.isFinite(estimated)
      ? clamp(Math.trunc(estimated), ESTIMATE_LIMITS.min, ESTIMATE_LIMITS.max)
      : 1,
    completedPomodoros:
      Number.isFinite(completed) && completed > 0 ? Math.trunc(completed) : 0,
  };
}

export function loadTodos(): Todo[] {
  const parsed = readJSON<unknown[]>(TODOS_KEY);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(migrateTodo).filter((todo): todo is Todo => todo !== null);
}

export function saveTodos(todos: Todo[]): void {
  writeJSON(TODOS_KEY, todos);
}

export function loadSettings(): TimerSettings {
  const stored = readJSON<Partial<TimerSettings>>(SETTINGS_KEY);
  if (!stored) return { ...DEFAULT_SETTINGS };

  const asDuration = (value: unknown, fallback: number) => {
    const n = Number(value);
    return Number.isFinite(n)
      ? clamp(Math.trunc(n), DURATION_LIMITS.min, DURATION_LIMITS.max)
      : fallback;
  };
  const asBool = (value: unknown, fallback: boolean) =>
    typeof value === "boolean" ? value : fallback;

  const interval = Number(stored.longBreakInterval);

  return {
    focus: asDuration(stored.focus, DEFAULT_SETTINGS.focus),
    shortBreak: asDuration(stored.shortBreak, DEFAULT_SETTINGS.shortBreak),
    longBreak: asDuration(stored.longBreak, DEFAULT_SETTINGS.longBreak),
    longBreakInterval: Number.isFinite(interval)
      ? clamp(Math.trunc(interval), INTERVAL_LIMITS.min, INTERVAL_LIMITS.max)
      : DEFAULT_SETTINGS.longBreakInterval,
    autoStartBreaks: asBool(
      stored.autoStartBreaks,
      DEFAULT_SETTINGS.autoStartBreaks
    ),
    autoStartFocus: asBool(
      stored.autoStartFocus,
      DEFAULT_SETTINGS.autoStartFocus
    ),
    soundEnabled: asBool(stored.soundEnabled, DEFAULT_SETTINGS.soundEnabled),
    notificationsEnabled: asBool(
      stored.notificationsEnabled,
      DEFAULT_SETTINGS.notificationsEnabled
    ),
  };
}

export function saveSettings(settings: TimerSettings): void {
  writeJSON(SETTINGS_KEY, settings);
}

export function loadActiveTaskId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_TASK_KEY);
  } catch {
    return null;
  }
}

export function saveActiveTaskId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id === null) localStorage.removeItem(ACTIVE_TASK_KEY);
    else localStorage.setItem(ACTIVE_TASK_KEY, id);
  } catch (error) {
    console.error("Failed to persist the active task:", error);
  }
}

export function createTodo(text: string, estimatedPomodoros = 1): Todo {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
    estimatedPomodoros: clamp(
      Math.trunc(estimatedPomodoros),
      ESTIMATE_LIMITS.min,
      ESTIMATE_LIMITS.max
    ),
    completedPomodoros: 0,
  };
}

export { clamp };
