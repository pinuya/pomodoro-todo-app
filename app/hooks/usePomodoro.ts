import { useCallback, useEffect, useRef, useState } from "react";

import type { TimerSettings } from "~/utils/todos";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export interface PomodoroTransition {
  finished: TimerMode;
  next: TimerMode;
  /** Round number that just finished, 1-based. Only set for focus sessions. */
  round?: number;
}

interface UsePomodoroOptions {
  settings: TimerSettings;
  onTransition: (transition: PomodoroTransition) => void;
}

const TICK_MS = 200;

export function durationMinutes(
  mode: TimerMode,
  settings: TimerSettings
): number {
  if (mode === "focus") return settings.focus;
  if (mode === "shortBreak") return settings.shortBreak;
  return settings.longBreak;
}

function durationMs(mode: TimerMode, settings: TimerSettings): number {
  return durationMinutes(mode, settings) * 60_000;
}

export function usePomodoro({ settings, onTransition }: UsePomodoroOptions) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(() =>
    durationMs("focus", settings)
  );
  const [completedRounds, setCompletedRounds] = useState(0);

  /** Wall-clock deadline while running; null while paused. */
  const endsAtRef = useRef<number | null>(null);
  /** Guards against one session firing its transition twice. */
  const completingRef = useRef(false);

  // Mirrors of state read from inside callbacks. State updater functions must
  // stay pure (StrictMode invokes them twice), so scheduling and counting are
  // driven by these refs instead.
  const modeRef = useRef(mode);
  const roundsRef = useRef(completedRounds);
  const remainingRef = useRef(remainingMs);
  const settingsRef = useRef(settings);
  const onTransitionRef = useRef(onTransition);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  useEffect(() => {
    onTransitionRef.current = onTransition;
  }, [onTransition]);

  const applyRemaining = useCallback((value: number) => {
    remainingRef.current = value;
    setRemainingMs(value);
  }, []);

  const startMode = useCallback(
    (nextMode: TimerMode, autoStart: boolean) => {
      const total = durationMs(nextMode, settingsRef.current);
      completingRef.current = false;
      modeRef.current = nextMode;
      setMode(nextMode);
      applyRemaining(total);
      endsAtRef.current = autoStart ? Date.now() + total : null;
      setIsRunning(autoStart);
    },
    [applyRemaining]
  );

  const complete = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;

    const current = settingsRef.current;
    const finished = modeRef.current;

    endsAtRef.current = null;
    setIsRunning(false);
    applyRemaining(0);

    if (finished === "focus") {
      const round = roundsRef.current + 1;
      roundsRef.current = round;
      setCompletedRounds(round);

      const next: TimerMode =
        round % current.longBreakInterval === 0 ? "longBreak" : "shortBreak";
      onTransitionRef.current({ finished, next, round });
      startMode(next, current.autoStartBreaks);
    } else {
      onTransitionRef.current({ finished, next: "focus" });
      startMode("focus", current.autoStartFocus);
    }
  }, [applyRemaining, startMode]);

  // One interval per running session. Remaining time is derived from a
  // deadline instead of being decremented, so a throttled background tab or a
  // sleeping machine can't make the countdown drift.
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      const endsAt = endsAtRef.current;
      if (endsAt === null) return;

      const left = endsAt - Date.now();
      if (left <= 0) complete();
      else applyRemaining(left);
    };

    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [isRunning, complete, applyRemaining]);

  // A paused timer follows its duration when settings change (including the
  // first load, where settings arrive from localStorage after mount).
  useEffect(() => {
    if (isRunning) return;
    completingRef.current = false;
    applyRemaining(durationMs(modeRef.current, settings));
  }, [settings, isRunning, applyRemaining]);

  const start = useCallback(() => {
    if (isRunning) return;
    const total =
      remainingRef.current > 0
        ? remainingRef.current
        : durationMs(modeRef.current, settingsRef.current);
    completingRef.current = false;
    endsAtRef.current = Date.now() + total;
    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    const endsAt = endsAtRef.current;
    if (endsAt !== null) applyRemaining(Math.max(0, endsAt - Date.now()));
    endsAtRef.current = null;
    setIsRunning(false);
  }, [isRunning, applyRemaining]);

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, pause, start]);

  const reset = useCallback(() => {
    startMode(modeRef.current, false);
  }, [startMode]);

  /** Move to the next session without crediting the current one. */
  const skip = useCallback(() => {
    if (modeRef.current === "focus") {
      const round = roundsRef.current + 1;
      roundsRef.current = round;
      setCompletedRounds(round);
      startMode(
        round % settingsRef.current.longBreakInterval === 0
          ? "longBreak"
          : "shortBreak",
        false
      );
    } else {
      startMode("focus", false);
    }
  }, [startMode]);

  const selectMode = useCallback(
    (nextMode: TimerMode) => startMode(nextMode, false),
    [startMode]
  );

  const totalMs = durationMs(mode, settings);
  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
  const progress =
    totalMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs)) : 0;
  const roundInCycle = (completedRounds % settings.longBreakInterval) + 1;

  return {
    mode,
    isRunning,
    secondsLeft,
    progress,
    completedRounds,
    roundInCycle,
    start,
    pause,
    toggle,
    reset,
    skip,
    selectMode,
  };
}
