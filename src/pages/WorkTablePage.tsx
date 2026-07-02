import { useState } from "react";
import { FileText, Layers, CheckSquare } from "lucide-react";
import TaskTab from "@/features/tasks/components/TaskTab/TaskTab";
import TrackerTab from "@/features/tasks/components/TrackerTab/TrackerTab";
import SubmissionTab from "@/features/tasks/components/SubmissionTab/SubmissionTab";

type SidebarTab = "task" | "tracker" | "submission";

export default function WorkTablePage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>("task");

  const renderActiveTab = () => {
    switch (activeSidebarTab) {
      case "task":
        return <TaskTab />;
      case "tracker":
        return <TrackerTab />;
      case "submission":
        return <SubmissionTab />;
      default:
        return <TaskTab />;
    }
  };

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-3.75rem)] grid grid-cols-[240px_1fr]">
      <aside className="flex flex-col items-center gap-2 border-r border-border">
        <div className="w-full border-b border-border p-5">
          <span className="text-xs text-red uppercase block mb-2">
            Мероприятие
          </span>
          <h2 className="text-white text-sm truncate">
            HackPrimeCode Лето 2026
          </h2>
        </div>

        <nav className="w-full flex flex-col gap-1 p-2">
          <button
            onClick={() => setActiveSidebarTab("task")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeSidebarTab === "task"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <FileText
              className={`w-4 h-4 ${activeSidebarTab === "task" ? "text-red" : ""}`}
            />
            <span>Задание</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab("tracker")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeSidebarTab === "tracker"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <Layers
              className={`w-4 h-4 ${activeSidebarTab === "tracker" ? "text-red" : ""}`}
            />
            <span>Таск-трекер</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab("submission")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeSidebarTab === "submission"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <CheckSquare
              className={`w-4 h-4 ${activeSidebarTab === "submission" ? "text-red" : ""}`}
            />
            <span>Сдача</span>
          </button>
        </nav>
      </aside>

      <main className="flex flex-col p-6">
        <div className="mb-2">
          <h1 className="text-2xl text-white mb-1">Рабочий стол</h1>
          <p className="text-xs text-text-accent">
            // Выполняйте задания, следите за прогрессом с помощью таск-трекера
          </p>
        </div>

        {renderActiveTab()}
      </main>
    </div>
  );
}
