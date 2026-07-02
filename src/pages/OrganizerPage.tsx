import { useState } from "react";
import { BookOpen, BarChart2, FileText, Settings, UserCheck } from "lucide-react";
import OverviewTab from "@/features/organizer/components/OverviewTab";
import TaskTab from "@/features/organizer/components/TaskTab";
import SettingsTab from "@/features/organizer/components/SettingsTab";
import JuryTab from "@/features/organizer/components/JuryTab";

type TabKey = "overview" | "task" | "settings" | "jury";

export default function OrganizerPage() {
  const [hasEvent] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  if (!hasEvent) {
    return (
      <div className="w-full max-w-232 mx-auto pt-8">
        <div className="mb-20">
          <h1 className="text-2xl text-white mb-1">Создайте свое мероприятие</h1>
        </div>

        <div className="w-full bg-card-background border border-border rounded-lg p-10.5 flex flex-col items-center justify-center">
          <div className="mb-6 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-text-accent" />
          </div>
          <h2 className="text-white mb-2.5">У вас нет мероприятий</h2>
          <p className="text-sm text-text-accent text-center mb-7">
            Создайте свое мероприятие, введите общую информацию, а затем добавьте все пункты
          </p>
          <button
            className="h-10 px-19 bg-red text-white text-sm rounded-lg flex items-center gap-2 hover:bg-red/90 transition-colors cursor-pointer"
          >
            <img src="./create-team-icon.svg" alt="" className="w-3.5 h-3.5" />
            Создать мероприятие
          </button>
        </div>
      </div>
      
    );
  }


  return (
    <div className="w-full mx-auto min-h-[calc(100vh-3.75rem)] grid grid-cols-[240px_1fr]">
      <aside className="flex flex-col items-center border-r border-border">
        <div className="w-full border-b border-border p-5">
          <span className="text-xs text-red uppercase block mb-2">Мероприятие</span>
          <h2 className="text-white text-sm truncate">HackPrimeCode Лето 2026</h2>
        </div>

        <nav className="w-full flex flex-col gap-1 p-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeTab === "overview"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <BarChart2 className={`w-4 h-4 ${activeTab === "overview" ? "text-red" : ""}`} />
            <span>Обзор</span>
          </button>

          <button
            onClick={() => setActiveTab("task")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeTab === "task"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === "task" ? "text-red" : ""}`} />
            <span>Задание</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeTab === "settings"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-red" : ""}`} />
            <span>Настройки</span>
          </button>

          <button
            onClick={() => setActiveTab("jury")}
            className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs cursor-pointer ${
              activeTab === "jury"
                ? "bg-red/6 border border-red text-red"
                : "text-text-accent hover:text-white hover:bg-input-background/50"
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activeTab === "jury" ? "text-red" : ""}`} />
            <span>Жюри</span>
          </button>
        </nav>
      </aside>

      <main className="flex flex-col p-6"> 
        <div className="mb-4">
          <h1 className="text-2xl text-white mb-1">{activeTab === "overview" ? "Обзор" : activeTab === "task" ? "Задание" : activeTab === "settings" ? "Настройки" : "Жюри"}</h1>
          <p className="text-xs text-text-accent">// Панель организатора · HackPrimeCode Лето 2026</p>
        </div>

        {activeTab === "overview" && <OverviewTab />}

        {activeTab === "task" && <TaskTab />}

        {activeTab === "settings" && <SettingsTab />}

        {activeTab === "jury" && <JuryTab />}
      </main>
    </div>
  );
}
