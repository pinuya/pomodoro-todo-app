// ~/utils/todos.client.ts

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const TODOS_KEY = "pomodoro_todos";

export function safeParseTodos(): Todo[] {
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

export function addTodo(text: string): void {
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

export function deleteTodo(id: string): void {
  const todos = safeParseTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  saveTodos(filteredTodos);
}

export function toggleTodo(id: string): void {
  const todos = safeParseTodos();
  const updatedTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(updatedTodos);
}
