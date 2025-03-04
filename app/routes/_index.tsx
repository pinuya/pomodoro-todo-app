import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  ListChecks,
  Minus,
  PictureInPicture2,
  X,
  Plus,
  Trash2,
  ClipboardList,
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "ToDo App" },
    { name: "ToDo App", content: "Welcome to ToDo App!" },
  ];
};

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ message: "Bem-vindo à lista de tarefas" });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const todoText = formData.get("todoItem");

  return json({
    intent,
    todoText,
  });
};

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("todos") || "[]")
        : [];

    return savedTodos;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    setTodos((prevTodos) => {
      const incompleteTodos = prevTodos.filter((todo) => !todo.completed);
      const completedTodos = prevTodos.filter((todo) => todo.completed);

      return [newTodo, ...incompleteTodos, ...completedTodos];
    });
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    const sortedTodos = [
      ...updatedTodos.filter((todo) => !todo.completed),
      ...updatedTodos.filter((todo) => todo.completed),
    ];

    setTodos(sortedTodos);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-100 rounded-2xl w-full max-w-2xl mx-auto border-2 shadow-lg">
        <header className="flex flex-row justify-between bg-400 border-b-2 rounded-t-2xl items-center py-3 px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <ListChecks className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="font-semibold text-lg sm:text-2xl">To Do</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <div className="p-1 flex items-center justify-center bg-300">
              <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="p-1 flex items-center justify-center bg-300">
              <PictureInPicture2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="p-1 flex items-center justify-center bg-300">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </header>

        <main className="p-4 flex flex-col justify-center items-center w-full space-y-10">
          <div className="w-full p-10 space-y-4">
            <span className="block text-center mb-2">
              Adicione um item a sua lista
            </span>

            <Form
              method="post"
              className="bg-300/60 border-2 rounded-2xl flex items-center p-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem(
                  "todoItem"
                ) as HTMLInputElement;

                if (input.value.trim()) {
                  addTodo(input.value);
                  input.value = "";
                }
              }}
            >
              <input
                type="text"
                name="todoItem"
                placeholder="Digite aqui..."
                className="flex-1 bg-transparent outline-none px-0 border-0 appearance-none focus:ring-0"
                style={{ backgroundColor: "transparent", boxShadow: "none" }}
              />
              <button type="submit">
                <Plus className="ml-2 cursor-pointer" />
              </button>
            </Form>
          </div>

          <div className="bg-400 w-full h-96 rounded-b-2xl flex justify-center items-center p-4">
            <div className="w-96">
              <div className="overflow-y-auto max-h-64 custom-scrollbar pr-2">
                {todos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 p-6">
                    <ClipboardList className="h-12 w-12 mb-4" />
                    <p className="text-lg">Lista vazia</p>
                    <p className="text-sm">Adicione novos itens</p>
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`
                        bg-100 border-2 p-4 w-full mb-4 flex items-center 
                        ${todo.completed ? "opacity-50 line-through" : ""}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="mr-3"
                      />
                      <span className="flex-1">{todo.text}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
