export const SUPPORTED_LOCALES = ["pt", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export const resources = {
  pt: {
    translation: {
      nav: {
        title: "Pomodoro",
        language: "Idioma",
      },
      timer: {
        focus: "Foco",
        shortBreak: "Pausa curta",
        longBreak: "Pausa longa",
        start: "Iniciar",
        pause: "Pausar",
        resume: "Retomar",
        reset: "Reiniciar",
        skip: "Pular",
        running: "Em foco",
        breakRunning: "Em pausa",
        paused: "Pausado",
        done: "Concluído",
        idle: "Pronto para começar",
        round: "Ciclo {{current}} de {{total}}",
        noTask: "Nenhuma tarefa selecionada",
        working: "Trabalhando em",
      },
      tasks: {
        title: "Tarefas",
        placeholder: "No que você vai trabalhar?",
        add: "Adicionar tarefa",
        empty: "Nenhuma tarefa ainda.",
        emptyHint: "Adicione uma acima para começar a focar.",
        delete: "Excluir tarefa",
        select: "Selecionar como tarefa ativa",
        active: "Tarefa ativa",
        toggle: "Marcar como concluída",
        estimate: "Estimativa de pomodoros",
        pomodoros: "{{done}}/{{total}} pomodoros",
        remaining: "{{count}} restante",
        remaining_other: "{{count}} restantes",
        clearCompleted: "Limpar concluídas",
      },
      settings: {
        title: "Configurações",
        open: "Abrir configurações",
        close: "Fechar",
        durations: "Durações (minutos)",
        focus: "Foco",
        shortBreak: "Pausa curta",
        longBreak: "Pausa longa",
        longBreakInterval: "Pausa longa a cada",
        rounds: "ciclos",
        automation: "Automação",
        autoStartBreaks: "Iniciar pausas automaticamente",
        autoStartFocus: "Iniciar focos automaticamente",
        alerts: "Alertas",
        sound: "Som ao terminar",
        notifications: "Notificações do navegador",
        notificationsBlocked:
          "As notificações foram bloqueadas no navegador. Libere nas permissões do site.",
        testSound: "Testar som",
        reset: "Restaurar padrões",
        save: "Salvar",
      },
      notifications: {
        focusDoneTitle: "Pomodoro concluído!",
        focusDoneBody: "Hora de fazer uma pausa.",
        focusDoneBodyTask: "“{{task}}” avançou. Hora de fazer uma pausa.",
        breakDoneTitle: "Pausa encerrada",
        breakDoneBody: "Bora para o próximo pomodoro.",
      },
      about: {
        heading: "Um cronômetro Pomodoro online para aumentar sua produtividade",
        whatTitle: "O que é um Pomodoro?",
        whatBody:
          'A Técnica Pomodoro foi criada por Francesco Cirillo para uma forma mais produtiva de trabalhar e estudar. A técnica utiliza um cronômetro para dividir o trabalho em intervalos, tradicionalmente de 25 minutos de duração, separados por pequenos intervalos. Cada intervalo é conhecido como pomodoro, da palavra italiana para "tomate", em referência ao cronômetro de cozinha em formato de tomate que Cirillo usava quando era estudante universitário.',
        source: "- Wikipédia",
        howTitle: "Como usar o Pomodoro?",
        step1: "Adicione tarefas para trabalhar hoje",
        step2:
          "Defina uma estimativa de pomodoros (1 = 25 min de trabalho) para cada tarefa",
        step3: "Inicie o cronômetro e concentre-se na tarefa por 25 minutos",
        step4: "Faça uma pausa de 5 minutos quando o alarme tocar",
        step5: "Repita de 3 a 5 até terminar as tarefas",
      },
      footer: {
        rights:
          "© {{year}} Pomodoro - ToDo. Desenvolvido para aumentar sua produtividade.",
        github: "Perfil no GitHub",
      },
    },
  },
  en: {
    translation: {
      nav: {
        title: "Pomodoro",
        language: "Language",
      },
      timer: {
        focus: "Focus",
        shortBreak: "Short break",
        longBreak: "Long break",
        start: "Start",
        pause: "Pause",
        resume: "Resume",
        reset: "Reset",
        skip: "Skip",
        running: "Focusing",
        breakRunning: "On a break",
        paused: "Paused",
        done: "Done",
        idle: "Ready to start",
        round: "Round {{current}} of {{total}}",
        noTask: "No task selected",
        working: "Working on",
      },
      tasks: {
        title: "Tasks",
        placeholder: "What are you working on?",
        add: "Add task",
        empty: "No tasks yet.",
        emptyHint: "Add one above to start focusing.",
        delete: "Delete task",
        select: "Set as active task",
        active: "Active task",
        toggle: "Mark as completed",
        estimate: "Estimated pomodoros",
        pomodoros: "{{done}}/{{total}} pomodoros",
        remaining: "{{count}} left",
        remaining_other: "{{count}} left",
        clearCompleted: "Clear completed",
      },
      settings: {
        title: "Settings",
        open: "Open settings",
        close: "Close",
        durations: "Durations (minutes)",
        focus: "Focus",
        shortBreak: "Short break",
        longBreak: "Long break",
        longBreakInterval: "Long break every",
        rounds: "rounds",
        automation: "Automation",
        autoStartBreaks: "Auto-start breaks",
        autoStartFocus: "Auto-start focus",
        alerts: "Alerts",
        sound: "Sound when time is up",
        notifications: "Browser notifications",
        notificationsBlocked:
          "Notifications are blocked in your browser. Allow them in the site permissions.",
        testSound: "Test sound",
        reset: "Restore defaults",
        save: "Save",
      },
      notifications: {
        focusDoneTitle: "Pomodoro complete!",
        focusDoneBody: "Time to take a break.",
        focusDoneBodyTask: "“{{task}}” moved forward. Time to take a break.",
        breakDoneTitle: "Break over",
        breakDoneBody: "Let's get to the next pomodoro.",
      },
      about: {
        heading: "An online Pomodoro timer to boost your productivity",
        whatTitle: "What is a Pomodoro?",
        whatBody:
          'The Pomodoro Technique was created by Francesco Cirillo as a more productive way to work and study. It uses a timer to break work into intervals, traditionally 25 minutes long, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for "tomato", after the tomato-shaped kitchen timer Cirillo used as a university student.',
        source: "- Wikipedia",
        howTitle: "How do you use the Pomodoro?",
        step1: "Add the tasks you want to work on today",
        step2: "Set a pomodoro estimate (1 = 25 min of work) for each task",
        step3: "Start the timer and focus on the task for 25 minutes",
        step4: "Take a 5 minute break when the alarm rings",
        step5: "Repeat 3 to 5 times until your tasks are done",
      },
      footer: {
        rights:
          "© {{year}} Pomodoro - ToDo. Built to boost your productivity.",
        github: "GitHub profile",
      },
    },
  },
} as const;
