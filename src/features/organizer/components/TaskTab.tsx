import { useState } from "react";
import { FileText, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import OrganizerTaskSpecTab from "@/features/organizer/components/tabs/OrganizerTaskSpecTab";
import OrganizerTaskFilesTab from "@/features/organizer/components/tabs/OrganizerTaskFilesTab";

export default function TaskTab() {
  const [hasTask, setHasTask] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [activeContentTab, setActiveContentTab] = useState<"spec" | "files">("spec");

  const handleCreateTask = () => {
    if (newTaskName.trim()) {
      setHasTask(true);
      setIsCreateTaskModalOpen(false);
      setNewTaskName("");
    }
  };

  if (!hasTask) {
    return (
      <>
        <div className="rounded-lg border border-border bg-card-background p-10.5 flex flex-col items-center justify-center text-center gap-4">
          <FileText className="w-10 h-10 text-text-accent" />

          <h2 className="text-white text-lg">
            У вас пока нет заданий
          </h2>

          <p className="text-sm text-text-accent max-w-xl">
            Создайте задание, назовите его, заполните все требования
          </p>

          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="h-10 px-19 bg-red text-white text-sm rounded-lg flex items-center gap-2 hover:bg-red/90 transition-colors cursor-pointer"
          >
            <img
              src="./create-team-icon.svg"
              alt=""
              className="w-3.5 h-3.5"
            />
            Создать задание
          </button>
        </div>

        {isCreateTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setIsCreateTaskModalOpen(false)}
            />

            <div className="relative w-full max-w-[435px] rounded-lg border-2 border-border bg-card-background overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">


              <div className="flex flex-col border-b-2 border-border px-6 py-5 gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="./create-team-modal-icon.svg"
                      alt=""
                      className="w-3.5 h-3.5"
                    />

                    <span className="text-xs uppercase tracking-wide text-red">
                      Создание задания
                    </span>
                  </div>

                  <button
                    onClick={() => setIsCreateTaskModalOpen(false)}
                    className="text-text-accent hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg">
                  Создайте задание для мероприятия
                </h3>
              </div>


              <div className="p-6">

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-text-accent">
                    Название задания
                  </label>

                  <div className="relative flex items-center group">
                    <Tag className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                    <Input
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Умный AI-мерчендайзер ..."
                      className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-red text-white text-sm font-medium hover:bg-red/90 transition-colors cursor-pointer"
                >
                  <img
                    src="./create-team-icon.svg"
                    alt=""
                    className="w-5 h-5"
                  />

                  Создать задание
                </button>

              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      <div className="p-4.5">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div className="flex gap-4 h-14.5 items-center">
            <div className="h-12 w-12 bg-red/6 border border-red rounded-lg flex items-center justify-center">
              <FileText className="w-6.5 h-6.5 text-red" />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <h3 className="text-lg font-medium text-white">
                {newTaskName || "Задание мероприятия"}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex bg-card-background border border-border p-1 rounded-lg w-fit mb-6 text-white text-xs">
          <button
            onClick={() => setActiveContentTab("spec")}
            className={`h-8 px-4 rounded-md transition-all cursor-pointer ${
              activeContentTab === "spec" && "bg-red"
            }`}
          >
            Техническое задание
          </button>
          <button
            onClick={() => setActiveContentTab("files")}
            className={`h-8 px-4 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeContentTab === "files"
                ? "bg-red text-white"
                : "text-text-accent hover:text-white"
            }`}
          >
            <span>Файлы задания</span>
          </button>
        </div>

        {activeContentTab === "spec" ? (
          <OrganizerTaskSpecTab />
        ) : (
          <OrganizerTaskFilesTab />
        )}
      </div>
    </div>
  );
}