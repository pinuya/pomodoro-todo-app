import { Coffee, Brain, RotateCcw, Settings, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePomodoro, type PomodoroTransition, type TimerMode } from "~/hooks/usePomodoro";
import { usePomodoroStore } from "~/hooks/usePomodoroStore";
import { notifyUser } from "~/utils/notifications";
import { playChime, primeAudio } from "~/utils/sound.client";
import SettingsDialog from "./SettingsDialog";
import TaskList from "./TaskList";

const MODES: { mode: TimerMode; labelKey: string }[] = [
  { mode: "focus", labelKey: "timer.focus" },
  { mode: "shortBreak", labelKey: "timer.shortBreak" },
  { mode: "longBreak", labelKey: "timer.longBreak" },
];

const MODE_STYLES: Record<
  TimerMode,
  { ring: string; card: string; button: string; chip: string }
> = {
  focus: {
    ring: "#5C665C",
    card: "border-600/40 bg-100",
    button: "bg-600 hover:bg-700",
    chip: "bg-600 text-white",
  },
  shortBreak: {
    ring: "#87B091",
    card: "border-400/50 bg-200",
    button: "bg-400 hover:bg-500",
    chip: "bg-400 text-white",
  },
  longBreak: {
    ring: "#A9C89F",
    card: "border-350/60 bg-200",
    button: "bg-350 hover:bg-400",
    chip: "bg-350 text-800",
  },
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const { t } = useTranslation();
  const store = usePomodoroStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  });

  const handleTransition = useCallback(
    ({ finished }: PomodoroTransition) => {
      const { settings, activeTask, creditPomodoro } = storeRef.current;

      if (finished === "focus" && activeTask) {
        creditPomodoro(activeTask.id);
      }

      if (settings.soundEnabled) {
        playChime(finished === "focus" ? "focusEnd" : "breakEnd");
      }

      if (settings.notificationsEnabled) {
        if (finished === "focus") {
          notifyUser(
            t("notifications.focusDoneTitle"),
            activeTask
              ? t("notifications.focusDoneBodyTask", { task: activeTask.text })
              : t("notifications.focusDoneBody")
          );
        } else {
          notifyUser(
            t("notifications.breakDoneTitle"),
            t("notifications.breakDoneBody")
          );
        }
      }
    },
    [t]
  );

  const timer = usePomodoro({
    settings: store.settings,
    onTransition: handleTransition,
  });

  const { mode, isRunning, secondsLeft, progress } = timer;
  const styles = MODE_STYLES[mode];
  const timeLabel = formatTime(secondsLeft);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const base = "Pomodoro - ToDo Site";
    document.title = isRunning ? `${timeLabel} · ${base}` : base;
    return () => {
      document.title = base;
    };
  }, [timeLabel, isRunning]);

  const handleToggle = () => {
    if (store.settings.soundEnabled) primeAudio();
    timer.toggle();
  };

  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  const statusText = isRunning
    ? mode === "focus"
      ? t("timer.running")
      : t("timer.breakRunning")
    : 
    progress === 0
    ? t("timer.idle")
    : t("timer.paused");

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`rounded-[2rem] border-2 p-5 shadow-xl transition-colors duration-500 sm:p-8 ${styles.card}`}
      >
       
        <div
          className="mb-6 flex items-center justify-center gap-1.5 rounded-full bg-300/50 p-1.5"
          role="tablist"
          aria-label={t("timer.focus")}
        >
          {MODES.map(({ mode: value, labelKey }) => {
            const isActive = value === mode;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => timer.selectMode(value)}
                className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-700 sm:text-sm ${
                  isActive
                    ? `${MODE_STYLES[value].chip} shadow-md`
                    : "text-700 hover:bg-100/70"
                }`}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center">
          
          <div className="relative h-56 w-56 sm:h-64 sm:w-64">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#C4D4AB"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={styles.ring}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-200 ease-linear"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-archivo text-5xl font-bold tabular-nums text-800 sm:text-6xl"
                role="timer"
                aria-live="off"
              >
                {timeLabel}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-medium text-700">
                {mode === "focus" ? (
                  <Brain className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Coffee className="h-4 w-4" aria-hidden="true" />
                )}
                {statusText}
              </span>
            </div>
          </div>

          <div className="mt-5 min-h-[3.25rem] w-full max-w-sm text-center">
            {store.activeTask ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-600">
                  {t("timer.working")}
                </p>
                <p className="truncate text-lg font-semibold text-800">
                  {store.activeTask.text}
                </p>
                <p className="text-sm tabular-nums text-700">
                  {t("tasks.pomodoros", {
                    done: store.activeTask.completedPomodoros,
                    total: store.activeTask.estimatedPomodoros,
                  })}
                </p>
              </>
            ) : (
              <p className="pt-3 text-sm text-600">{t("timer.noTask")}</p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={timer.reset}
              aria-label={t("timer.reset")}
              title={t("timer.reset")}
              className="rounded-full border-2 border-500/40 p-3 text-700 transition-all hover:bg-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleToggle}
              className={`min-w-[9rem] rounded-full px-10 py-4 text-lg font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-700 focus-visible:ring-offset-2 ${styles.button}`}
            >
              {isRunning ? t("timer.pause") : t("timer.start")}
            </button>

            <button
              type="button"
              onClick={timer.skip}
              aria-label={t("timer.skip")}
              title={t("timer.skip")}
              className="rounded-full border-2 border-500/40 p-3 text-700 transition-all hover:bg-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
            >
              <SkipForward className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 flex w-full items-center justify-between gap-3 border-t-2 border-400/20 pt-4">
            <span className="text-sm font-medium tabular-nums text-700">
              {t("timer.round", {
                current: timer.roundInCycle,
                total: store.settings.longBreakInterval,
              })}
            </span>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label={t("settings.open")}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-700 transition-colors hover:bg-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              {t("settings.title")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border-2 border-400/30 bg-100/60 p-5 shadow-lg sm:p-6">
        <TaskList
          todos={store.todos}
          activeTaskId={store.activeTaskId}
          remainingCount={store.remainingCount}
          onAdd={store.addTask}
          onToggle={store.toggleTask}
          onDelete={store.deleteTask}
          onSelect={store.setActiveTaskId}
          onEstimate={store.setEstimate}
          onClearCompleted={store.clearCompleted}
        />
      </div>

      {settingsOpen ? (
        <SettingsDialog
          settings={store.settings}
          onClose={() => setSettingsOpen(false)}
          onChange={store.setSettings}
        />
      ) : null}
    </div>
  );
}
