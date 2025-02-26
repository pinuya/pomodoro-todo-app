import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "ToDo App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <div className="flex h-screen items-center justify-center">teste</div>;
}
