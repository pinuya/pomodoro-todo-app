import { Check, ListTodo, Minus, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ESTIMATE_LIMITS, type Todo } from "~/utils/todos";

interface TaskListProps {
  todos: Todo[];
  activeTaskId: string | null;
  remainingCount: number;
  onAdd: (text: string, estimate: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onEstimate: (id: string, estimate: number) => void;
  onClearCompleted: () => void;
}

export default function TaskList({
  todos,
  activeTaskId,
  remainingCount,
  onAdd,
  onToggle,
  onDelete,
  onSelect,
  onEstimate,
  onClearCompleted,
}: TaskListProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [estimate, setEstimate] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasCompleted = todos.some((todo) => todo.completed);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text, estimate);
    setText("");
    setEstimate(1);
    inputRef.current?.focus();
  };

  return (
    <section className="w-full" aria-labelledby="tasks-heading">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2
          id="tasks-heading"
          className="flex items-center gap-2 text-lg font-bold text-800"
        >
          <ListTodo className="h-5 w-5 text-600" aria-hidden="true" />
          {t("tasks.title")}
        </h2>
        <span className="text-sm font-medium text-700">
          {t("tasks.remaining", { count: remainingCount })}
        </span>
      </div>

      <form
        onSubmit={submit}
        className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-400/40 bg-100 p-2 transition-colors focus-within:border-600"
      >
        <input
          ref={inputRef}
          type="text"
          name="todoItem"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("tasks.placeholder")}
          aria-label={t("tasks.placeholder")}
          className="bg-transparent min-w-0 flex-1 border-0 px-2 text-800 outline-none placeholder:text-600/70 focus:ring-0"
        />
        <input
          type="number"
          value={estimate}
          min={ESTIMATE_LIMITS.min}
          max={ESTIMATE_LIMITS.max}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) {
              setEstimate(
                Math.min(
                  ESTIMATE_LIMITS.max,
                  Math.max(ESTIMATE_LIMITS.min, Math.trunc(next))
                )
              );
            }
          }}
          aria-label={t("tasks.estimate")}
          title={t("tasks.estimate")}
          className="w-14 rounded-xl border-2 border-350/60 bg-200/60 px-2 py-1.5 text-center text-sm font-bold text-800 outline-none focus:border-600"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label={t("tasks.add")}
          className="rounded-xl bg-600 p-2 text-white shadow transition-all hover:bg-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-400/50 px-6 py-10 text-center">
          <p className="font-semibold text-800">{t("tasks.empty")}</p>
          <p className="mt-1 text-sm text-700">{t("tasks.emptyHint")}</p>
        </div>
      ) : (
        <ul className="tasks-scroll max-h-[22rem] space-y-2 overflow-y-auto pr-2">
          {todos.map((todo) => {
            const isActive = todo.id === activeTaskId;
            return (
              <li
                key={todo.id}
                className={`group flex items-center gap-3 rounded-2xl border-2 bg-100 p-3 transition-all duration-150 ${
                  isActive
                    ? "border-600 shadow-md"
                    : "border-400/30 hover:border-400/70"
                } ${todo.completed ? "opacity-60" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onToggle(todo.id)}
                  role="checkbox"
                  aria-checked={todo.completed}
                  aria-label={t("tasks.toggle")}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-600 ${
                    todo.completed
                      ? "border-600 bg-600 text-white"
                      : "border-500 hover:bg-300"
                  }`}
                >
                  {todo.completed ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => onSelect(todo.id)}
                  aria-label={t("tasks.select")}
                  aria-pressed={isActive}
                  className="min-w-0 flex-1 rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-600 focus-visible:ring-offset-1"
                >
                  <span
                    className={`block truncate font-medium text-800 ${
                      todo.completed ? "line-through decoration-2" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  {isActive ? (
                    <span className="text-xs font-bold uppercase tracking-wide text-600">
                      {t("tasks.active")}
                    </span>
                  ) : null}
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onEstimate(todo.id, todo.estimatedPomodoros - 1)
                    }
                    disabled={todo.estimatedPomodoros <= ESTIMATE_LIMITS.min}
                    aria-label={`${t("tasks.estimate")} −`}
                    className="rounded-lg p-1 text-700 opacity-0 transition-opacity hover:bg-300 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-600 disabled:opacity-0 group-hover:opacity-100"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <span
                    className="min-w-[3ch] text-center text-sm font-bold tabular-nums text-700"
                    title={t("tasks.pomodoros", {
                      done: todo.completedPomodoros,
                      total: todo.estimatedPomodoros,
                    })}
                  >
                    {todo.completedPomodoros}/{todo.estimatedPomodoros}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onEstimate(todo.id, todo.estimatedPomodoros + 1)
                    }
                    disabled={todo.estimatedPomodoros >= ESTIMATE_LIMITS.max}
                    aria-label={`${t("tasks.estimate")} +`}
                    className="rounded-lg p-1 text-700 opacity-0 transition-opacity hover:bg-300 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-600 disabled:opacity-0 group-hover:opacity-100"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(todo.id)}
                    aria-label={t("tasks.delete")}
                    className="hover:bg-danger/15 hover:text-danger ml-1 rounded-lg p-1.5 text-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasCompleted ? (
        <button
          type="button"
          onClick={onClearCompleted}
          className="mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold text-700 transition-colors hover:bg-300/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
        >
          {t("tasks.clearCompleted")}
        </button>
      ) : null}
    </section>
  );
}
