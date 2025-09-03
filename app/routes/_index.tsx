import { Link } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "~/styles/custom-scrollbar.css";
import PomodoroTimer from "~/components/Pomodoro";
import Tasks from "~/components/Tasks";
import { FaGithub } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "Pomodoro - ToDo Site" },
    { name: "Pomodoro - ToDo Site", content: "Pomodoro - ToDo Site" },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex flex-row items-center justify-center border-b-2 bg-400 px-4 py-3">
        <Link to={"/"} className="flex items-center gap-2 sm:gap-4">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="h-6 w-6 sm:h-8 sm:w-8"
          />
          <h1 className="text-lg font-semibold sm:text-2xl">Pomodoro</h1>
        </Link>
      </nav>

      <main className="flex-grow">
        <section className="flex min-h-screen items-center justify-center py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="flex w-full justify-center">
                <PomodoroTimer />
              </div>

              <div className="flex w-full justify-center">
                <Tasks />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-2xl font-semibold text-800">
              Um cronômetro Pomodoro online para aumentar sua produtividade
            </h1>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-900">
                O que é um Pomodoro?
              </h2>
              <div className="h-1 w-4 bg-350"></div>
              <p className="text-gray-700 leading-relaxed">
                A Técnica Pomodoro foi criada por Francesco Cirillo para uma
                forma mais produtiva de trabalhar e estudar. A técnica utiliza
                um cronômetro para dividir o trabalho em intervalos,
                tradicionalmente de 25 minutos de duração, separados por
                pequenos intervalos. Cada intervalo é conhecido como pomodoro,
                da palavra italiana para "tomate", em referência ao cronômetro
                de cozinha em formato de tomate que Cirillo usava quando era
                estudante universitário.{" "}
                <span className="text-500">- Wikipédia</span>
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="mt-5 text-xl font-semibold text-900">
                Como usar o Pomodoro?
              </h2>
              <div className="h-1 w-4 bg-350"></div>

              <ol className="text-gray-700 list-inside list-decimal space-y-2">
                <li>Adicione tarefas para trabalhar hoje</li>
                <li>
                  Defina uma estimativa de pomodoros (1 = 25 min de trabalho)
                  para cada tarefa
                </li>
                <li>
                  Inicie o cronômetro e concentre-se na tarefa por 25 minutos
                </li>
                <li>Faça uma pausa de 5 minutos quando o alarme tocar</li>
                <li>Repita de 3 a 5 até terminar as tarefas</li>
              </ol>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-gray-600 flex justify-center gap-5 bg-white px-4 py-4">
        <p>
          &copy; 2025 <span className="text-500">Pomodoro - ToDo</span> .
          Desenvolvido para aumentar sua produtividade.
        </p>

        <Link to={"https://github.com/pinuya"}>
          <FaGithub className="h-6 w-6 text-400 hover:text-700" />
        </Link>
      </footer>
    </div>
  );
}
