import { ClipboardList, Plus, Trash2 } from "lucide-react";
import PerfectScrollbar from "perfect-scrollbar";
import { useEffect, useRef, useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const TODOS_KEY = "pomodoro_todos";

function safeParseTodos(): Todo[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(TODOS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao carregar todos:", error);
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Erro ao salvar todos:", error);
  }
}

function addTodo(text: string): void {
  const todos = safeParseTodos();
  const newTodo: Todo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };

  todos.push(newTodo);
  saveTodos(todos);
}

function deleteTodo(id: string): void {
  const todos = safeParseTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  saveTodos(filteredTodos);
}

function toggleTodo(id: string): void {
  const todos = safeParseTodos();
  const updatedTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(updatedTodos);
}

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setTodos(safeParseTodos());
  }, []);

  const refreshTodos = () => {
    setTodos(safeParseTodos());
  };

  const handleAddTodo = (text: string) => {
    if (text.trim()) {
      addTodo(text);
      refreshTodos();
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    refreshTodos();
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    refreshTodos();
  };

  return {
    todos,
    handleAddTodo,
    handleDeleteTodo,
    handleToggleTodo,
  };
}

export default function Tasks() {
  const { todos, handleAddTodo, handleDeleteTodo, handleToggleTodo } =
    useTodos();
  const todoFormRef = useRef<HTMLFormElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const psRef = useRef<PerfectScrollbar | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current && !psRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 1,
        wheelPropagation: true,
        minScrollbarLength: 20,
        suppressScrollX: true,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (psRef.current) {
      setTimeout(() => {
        psRef.current?.update();
      }, 0);
    }
  }, [todos]);

  const handleSubmitTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const todoText = formData.get("todoItem") as string;

    if (todoText?.trim()) {
      handleAddTodo(todoText.trim());
      if (todoFormRef.current) {
        todoFormRef.current.reset();
      }
    }
  };

  const handleToggleChange = (id: string) => {
    handleToggleTodo(id);
  };

  const handleDelete = (id: string) => {
    handleDeleteTodo(id);
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <main className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="w-full space-y-4 p-10">
          <span className="mb-2 block text-center text-2xl font-semibold">
            Tasks
          </span>

          <form
            ref={todoFormRef}
            onSubmit={handleSubmitTodo}
            className="flex items-center rounded-2xl border-2 bg-300/60 p-2"
          >
            <input
              type="text"
              name="todoItem"
              placeholder="Digite aqui..."
              className="bg-transparent flex-1 appearance-none border-0 px-0 outline-none focus:ring-0"
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
            <button type="submit">
              <Plus className="ml-2 cursor-pointer" />
            </button>
          </form>
        </div>

        <div className="flex w-full items-center justify-center rounded-b-2xl p-4">
          <div className="w-96">
            <div
              ref={scrollContainerRef}
              className="relative max-h-64 overflow-y-auto pr-6"
            >
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`
                    bg-100 border-2 p-4 w-full mb-4 flex items-center 
                    ${
                      todo.completed
                        ? "opacity-50 line-through decoration-2"
                        : ""
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleChange(todo.id)}
                    className="mr-3"
                  />
                  <span className="flex-1">{todo.text}</span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
