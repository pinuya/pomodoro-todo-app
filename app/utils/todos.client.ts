import { z } from "zod";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const todosSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
});

export const todosListSchema = z.array(todosSchema);

export const safeParseTodos = () => {
  try {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    return todosListSchema.parse(todos);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  const prevTodos = safeParseTodos();
  const incompleteTodos = prevTodos.filter((todo) => !todo.completed);
  const completedTodos = prevTodos.filter((todo) => todo.completed);

  const newTodos = [newTodo, ...incompleteTodos, ...completedTodos];
  localStorage.setItem("todos", JSON.stringify(newTodos));
};

export const deleteTodo = (id: string) => {
  const prevTodos = safeParseTodos();

  const newTodos = prevTodos.filter((todo) => todo.id !== id);
  localStorage.setItem("todos", JSON.stringify(newTodos));
};

export const toggleTodo = (id: string) => {
  const prevTodos = safeParseTodos();
  const updatedTodos = prevTodos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  const sortedTodos = [
    ...updatedTodos.filter((todo) => !todo.completed),
    ...updatedTodos.filter((todo) => todo.completed),
  ];

  localStorage.setItem("todos", JSON.stringify(sortedTodos));
};
