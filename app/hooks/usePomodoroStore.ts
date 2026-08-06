import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_SETTINGS,
  ESTIMATE_LIMITS,
  clamp,
  createTodo,
  loadActiveTaskId,
  loadPlaylistUrl,
  loadSettings,
  loadTodos,
  saveActiveTaskId,
  savePlaylistUrl,
  saveSettings,
  saveTodos,
  type TimerSettings,
  type Todo,
} from "~/utils/todos";

export function usePomodoroStore() {
  // Server render and first client render must match, so everything starts at
  // its default and the stored values are read after mount.
  const [hydrated, setHydrated] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState("");

  useEffect(() => {
    // Syncing from an external store (localStorage) on mount. It has to happen
    // in an effect rather than during render: the server has no localStorage,
    // so reading it earlier would make the first client render disagree with
    // the server HTML and break hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodos(loadTodos());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loadSettings());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTaskId(loadActiveTaskId());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaylistUrl(loadPlaylistUrl());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Persist only after hydration, otherwise the initial empty state would
  // immediately overwrite what the user already had stored.
  useEffect(() => {
    if (hydrated) saveTodos(todos);
  }, [todos, hydrated]);

  useEffect(() => {
    if (hydrated) saveSettings(settings);
  }, [settings, hydrated]);

  useEffect(() => {
    if (hydrated) saveActiveTaskId(activeTaskId);
  }, [activeTaskId, hydrated]);

  useEffect(() => {
    if (hydrated) savePlaylistUrl(playlistUrl);
  }, [playlistUrl, hydrated]);

  const addTask = useCallback((text: string, estimate = 1) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const todo = createTodo(trimmed, estimate);
    setTodos((prev) => [...prev, todo]);
    // First task added becomes the active one so the timer has a target.
    setActiveTaskId((current) => current ?? todo.id);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setActiveTaskId((current) => (current === id ? null : current));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const setEstimate = useCallback((id: string, estimate: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              estimatedPomodoros: clamp(
                Math.trunc(estimate),
                ESTIMATE_LIMITS.min,
                ESTIMATE_LIMITS.max
              ),
            }
          : todo
      )
    );
  }, []);

  /** Credits one finished focus session to a task. */
  const creditPomodoro = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completedPomodoros: todo.completedPomodoros + 1 }
          : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => {
      const remaining = prev.filter((todo) => !todo.completed);
      setActiveTaskId((current) =>
        current && remaining.some((todo) => todo.id === current)
          ? current
          : null
      );
      return remaining;
    });
  }, []);

  const activeTask = useMemo(
    () => todos.find((todo) => todo.id === activeTaskId) ?? null,
    [todos, activeTaskId]
  );

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  return {
    hydrated,
    todos,
    settings,
    setSettings,
    activeTask,
    activeTaskId,
    setActiveTaskId,
    playlistUrl,
    setPlaylistUrl,
    addTask,
    deleteTask,
    toggleTask,
    setEstimate,
    creditPomodoro,
    clearCompleted,
    remainingCount,
  };
}
