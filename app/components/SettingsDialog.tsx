import { Volume2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "~/utils/notifications";
import { playChime } from "~/utils/sound.client";
import {
  DEFAULT_SETTINGS,
  DURATION_LIMITS,
  INTERVAL_LIMITS,
  clamp,
  type TimerSettings,
} from "~/utils/todos";

interface SettingsDialogProps {
  settings: TimerSettings;
  onClose: () => void;
  /** Accepts an updater so two quick toggles can't overwrite each other. */
  onChange: React.Dispatch<React.SetStateAction<TimerSettings>>;
}

function NumberField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-700">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onChange(clamp(Math.trunc(next), min, max));
          }}
          className="w-full rounded-xl border-2 border-350/60 bg-100 px-3 py-2 text-lg font-bold text-800 outline-none transition-colors focus:border-600"
        />
        {suffix ? (
          <span className="whitespace-nowrap text-sm text-700">{suffix}</span>
        ) : null}
      </span>
    </label>
  );
}

function Toggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-4 rounded-xl px-1 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-600 ${
        disabled ? "cursor-not-allowed opacity-60" : "hover:bg-300/40"
      }`}
    >
      <span className="text-sm font-medium text-800">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-600" : "bg-350"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

/**
 * Mounted only while open (see Pomodoro.tsx). That's deliberate: it means the
 * initial state below re-reads the live browser permission on every open, with
 * no effect needed — the user may have changed it in site settings meanwhile.
 */
export default function SettingsDialog({
  settings,
  onClose,
  onChange,
}: SettingsDialogProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [permission, setPermission] = useState(() =>
    getNotificationPermission()
  );

  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const update = <K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => onChange((prev) => ({ ...prev, [key]: value }));

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (!enabled) {
      update("notificationsEnabled", false);
      return;
    }
    
    const result = await requestNotificationPermission();
    setPermission(result);
    update("notificationsEnabled", result === "granted");
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="animate-scale-in max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-2 border-400/50 bg-200 p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-bold text-800">
            {t("settings.title")}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("settings.close")}
            className="rounded-full p-2 text-700 transition-colors hover:bg-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <section className="mb-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-600">
            {t("settings.durations")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <NumberField
              label={t("settings.focus")}
              value={settings.focus}
              min={DURATION_LIMITS.min}
              max={DURATION_LIMITS.max}
              onChange={(value) => update("focus", value)}
            />
            <NumberField
              label={t("settings.shortBreak")}
              value={settings.shortBreak}
              min={DURATION_LIMITS.min}
              max={DURATION_LIMITS.max}
              onChange={(value) => update("shortBreak", value)}
            />
            <NumberField
              label={t("settings.longBreak")}
              value={settings.longBreak}
              min={DURATION_LIMITS.min}
              max={DURATION_LIMITS.max}
              onChange={(value) => update("longBreak", value)}
            />
          </div>
          <div className="mt-4">
            <NumberField
              label={t("settings.longBreakInterval")}
              value={settings.longBreakInterval}
              min={INTERVAL_LIMITS.min}
              max={INTERVAL_LIMITS.max}
              suffix={t("settings.rounds")}
              onChange={(value) => update("longBreakInterval", value)}
            />
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-600">
            {t("settings.automation")}
          </h3>
          <Toggle
            label={t("settings.autoStartBreaks")}
            checked={settings.autoStartBreaks}
            onChange={(value) => update("autoStartBreaks", value)}
          />
          <Toggle
            label={t("settings.autoStartFocus")}
            checked={settings.autoStartFocus}
            onChange={(value) => update("autoStartFocus", value)}
          />
        </section>

        <section className="mb-6">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-600">
            {t("settings.alerts")}
          </h3>
          <Toggle
            label={t("settings.sound")}
            checked={settings.soundEnabled}
            onChange={(value) => {
              update("soundEnabled", value);
              if (value) playChime("focusEnd");
            }}
          />
          <Toggle
            label={t("settings.notifications")}
            checked={settings.notificationsEnabled && permission === "granted"}
            disabled={permission === "denied" || permission === "unsupported"}
            onChange={(value) => void handleNotificationsToggle(value)}
          />
          {permission === "denied" ? (
            <p className="bg-danger/10 mt-1 rounded-xl px-3 py-2 text-xs text-800">
              {t("settings.notificationsBlocked")}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => playChime("focusEnd")}
            className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-500/50 px-4 py-2 text-sm font-semibold text-700 transition-colors hover:bg-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            {t("settings.testSound")}
          </button>
        </section>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_SETTINGS })}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-700 transition-colors hover:bg-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
          >
            {t("settings.reset")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-600 focus-visible:ring-offset-2"
          >
            {t("settings.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
