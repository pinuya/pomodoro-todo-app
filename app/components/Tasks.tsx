import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import PerfectScrollbar from "perfect-scrollbar";
import { useEffect, useRef } from "react";
import {
  addTodo,
  deleteTodo,
  safeParseTodos,
  toggleTodo,
} from "~/utils/todos.client";

export const action = () => ({});

export const clientAction = async ({
  request,
  serverAction,
}: ClientActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const intent = formData.get("intent");
  const todoText = formData.get("todoItem");
  const id = formData.get("id");

  if (intent === "add" && todoText) {
    addTodo(todoText as string);
  }

  if (intent === "delete") {
    deleteTodo(id as string);
  }

  if ((intent === "toggle" && id) || (id && intent === null)) {
    toggleTodo(id as string);
  }

  return await serverAction();
};

export const clientLoader = () => {
  const parsedTodos = safeParseTodos();
  return {
    todos: parsedTodos,
  };
};

export default function Tasks() {
  const { todos } = useLoaderData<typeof clientLoader>();
  const submit = useSubmit();
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
    setTimeout(() => {
      if (todoFormRef.current) {
        todoFormRef.current.reset();
      }
    }, 10);
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border-2 bg-100 shadow-lg">
      <main className="flex w-full flex-col items-center justify-center space-y-10 p-4">
        <div className="w-full space-y-4 p-10">
          <span className="mb-2 block text-center">
            Adicione um item a sua lista
          </span>

          <Form
            ref={todoFormRef}
            method="post"
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
            <button type="submit" value={"add"} name="intent">
              <Plus className="ml-2 cursor-pointer" />
            </button>
          </Form>
        </div>

        <div className="flex h-96 w-full items-center justify-center rounded-b-2xl bg-400 p-4">
          <div className="w-96">
            <div
              ref={scrollContainerRef}
              className="relative max-h-64 overflow-y-auto pr-6"
            >
              {todos.length === 0 ? (
                <div className="text-gray-500 flex flex-col items-center justify-center p-6 text-center">
                  <ClipboardList className="mb-4 h-12 w-12" />
                  <p className="text-lg">Lista vazia</p>
                  <p className="text-sm">Adicione novos itens</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <Form
                    onChange={(e) => {
                      submit(e.currentTarget);
                    }}
                    method="post"
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
                    <input type="hidden" name="id" value={todo.id} />
                    <input
                      name="intent"
                      value={"toggle"}
                      type="checkbox"
                      defaultChecked={todo.completed}
                      className="mr-3"
                    />
                    <span className="flex-1">{todo.text}</span>
                    <button
                      name="intent"
                      value="delete"
                      type="submit"
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </Form>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
