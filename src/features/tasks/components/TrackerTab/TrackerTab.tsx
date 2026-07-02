import { useState } from "react";
import { Plus, X, Eye } from "lucide-react";
import type { HackathonTask, HackathonTasks } from "../../model/taskTypes";

type ColumnType = "backlog" | "in_work" | "review" | "done";

const COLUMNS_CONFIG: Record<
  ColumnType,
  { title: string; countStyles: string }
> = {
  backlog: {
    title: "Бэклог",
    countStyles: "text-text-accent bg-text-accent/15 px-1 py-px rounded-sm",
  },
  in_work: {
    title: "В работе",
    countStyles: "text-text-accent bg-text-accent/15 px-1 py-px rounded-sm",
  },
  review: {
    title: "Ревью",
    countStyles: "text-text-accent bg-text-accent/15 px-1 py-px rounded-sm",
  },
  done: {
    title: "Готово",
    countStyles: "text-red bg-red/25 px-1 py-px rounded-sm",
  },
};

export const initialMockTasks: HackathonTasks = {
  team_id: "byteforce-1",
  team_members: [
    {
      id: 1,
      user_id: 1,
      team_id: 1,
      email: "killoq7@gmail.com",
      name: "Алексей Иванов",
      skills: ["ML"],
      is_captain: true,
      avatar_color: "bg-red-600",
    },
    {
      id: 2,
      user_id: 2,
      team_id: 1,
      email: "mikhail@gmail.com",
      name: "Михаил Кирсанов",
      skills: ["Go"],
      is_captain: false,
      avatar_color: "bg-cyan-600",
    },
  ],
  tasks: {
    backlog: [
      {
        id: "00011",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
      {
        id: "00012",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
      {
        id: "00013",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
      {
        id: "00014",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
      {
        id: "00015",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
      {
        id: "00016",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
      {
        id: "00017",
        title: "Тестирование на Frontend",
        tag: "Frontend",
        description: "Модульное и интеграционное тестирование Frontend-модулей",
        assignee: {
          name: "Алексей Иванов",
          color: "bg-red-600",
        },
      },
    ],
    in_work: [],
    review: [],
    done: [],
  },
};

export default function TrackerTab() {
  const [boardData, setBoardData] = useState<HackathonTasks>(initialMockTasks);
  const [draggedInfo, setDraggedInfo] = useState<{
    taskId: string;
    sourceColumn: ColumnType;
  } | null>(null);

  const [viewingTask, setViewingTask] = useState<HackathonTask | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [targetCreateColumn, setTargetCreateColumn] =
    useState<ColumnType>("backlog");

  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("Frontend");
  const [newDesc, setNewDesc] = useState("");
  const [newAssigneeId, setNewAssigneeId] = useState<string>("");

  const handleDragStart = (taskId: string, sourceColumn: ColumnType) => {
    setDraggedInfo({ taskId, sourceColumn });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumn: ColumnType) => {
    if (!draggedInfo) return;
    const { taskId, sourceColumn } = draggedInfo;

    if (sourceColumn === targetColumn) {
      setDraggedInfo(null);
      return;
    }

    setBoardData((prev) => {
      const updatedTasks = { ...prev.tasks };
      const taskToMove = updatedTasks[sourceColumn].find(
        (t) => t.id === taskId,
      );
      if (!taskToMove) return prev;

      updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
        (t) => t.id !== taskId,
      );
      updatedTasks[targetColumn] = [...updatedTasks[targetColumn], taskToMove];

      return { ...prev, tasks: updatedTasks };
    });

    setDraggedInfo(null);
  };

  const openCreateModal = (colKey: ColumnType) => {
    setTargetCreateColumn(colKey);
    setIsCreateOpen(true);
  };

  const handleCreateTask = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedMember = boardData.team_members.find(
      (m) => m.id === Number(newAssigneeId),
    );

    const newTask: HackathonTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      tag: newTag,
      description: newDesc,
      assignee: selectedMember
        ? {
            name: selectedMember.name,
            color: selectedMember.avatar_color || "bg-zinc-600",
          }
        : undefined,
    };

    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [targetCreateColumn]: [...prev.tasks[targetCreateColumn], newTask],
      },
    }));

    setNewTitle("");
    setNewDesc("");
    setNewAssigneeId("");
    setIsCreateOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 animate-fadeIn p-4.5">
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          <span>BF</span>
        </div>
        <div>
          <h2 className="text-white text-base font-medium">ByteForce</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {(Object.keys(COLUMNS_CONFIG) as ColumnType[]).map((colKey) => {
          const column = COLUMNS_CONFIG[colKey];
          const tasks = boardData.tasks[colKey];

          return (
            <div
              key={colKey}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(colKey)}
              className="flex flex-col gap-3 lg:min-h-110 rounded-lg pb-6"
            >
              <div
                className={`flex items-center justify-between px-1 pb-3 border-b ${colKey === "done" ? "border-red" : "border-border"}`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white">{column.title}</span>
                  <span className={column.countStyles}>{tasks.length}</span>
                </div>
                <button
                  onClick={() => openCreateModal(colKey)}
                  className="text-text-accent hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id, colKey)}
                    className="group border border-border rounded-lg bg-card-background p-3 flex flex-col gap-2.5 cursor-grab active:cursor-grabbing hover:border-border/80 transition-all shadow-sm position-relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-fit px-2 py-0.5 bg-text-accent/20 rounded text-xs text-text-accent">
                        {task.tag}
                      </div>
                    </div>

                    <h4 className="text-xs text-white leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      {task.assignee ? (
                        <div className="flex items-center gap-2 max-w-[75%]">
                          <div
                            className={`w-5 h-5 rounded-full ${task.assignee.color} flex items-center justify-center text-[0.625rem] text-white font-bold shrink-0`}
                          >
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-[0.6875rem] text-text-accent truncate">
                            {task.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[0.6875rem] text-text-accent">
                          Без исполнителя
                        </div>
                      )}

                      <button
                        onClick={() => setViewingTask(task)}
                        className="text-text-accent hover:text-white p-1 rounded hover:bg-input-background/40 transition-colors cursor-pointer"
                        title="Просмотр задачи"
                      >
                        <Eye className="w-4 h-4 text-red" />
                      </button>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="border border-dashed border-text-accent rounded-lg py-10 text-center text-xs text-text-accent select-none">
                    Перетащите задачу сюда
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {viewingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-card-background border border-border rounded-sm w-full px-6 py-4.5 max-w-md overflow-hidden text-white shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <span className="text-lg text-white">{viewingTask.title}</span>
              <button
                type="button"
                onClick={() => setViewingTask(null)}
                className="text-text-accent hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-text-accent uppercase font-medium">
                  Название
                </label>
                <input
                  type="text"
                  readOnly
                  value={viewingTask.title}
                  className="w-full h-10 bg-input-background border border-border rounded-sm px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-text-accent uppercase font-medium">
                    Тег
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewingTask.tag}
                    className="w-full h-10 bg-input-background border border-border rounded-sm px-3 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-text-accent uppercase font-medium">
                    Исполнитель
                  </label>
                  <div className="w-full h-10 bg-input-background border border-border rounded-sm px-3 flex items-center gap-2.5">
                    {viewingTask.assignee ? (
                      <>
                        <div
                          className={`w-5 h-5 rounded-full ${viewingTask.assignee.color} flex items-center justify-center text-[10px] text-white font-bold shrink-0`}
                        >
                          {viewingTask.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-xs text-white truncate">
                          {viewingTask.assignee.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-text-accent/50 italic">
                        Не назначен
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-text-accent uppercase font-medium">
                  Описание
                </label>
                <textarea
                  readOnly
                  value={viewingTask.description || "Описание отсутствует..."}
                  className="w-full min-h-32 bg-input-background border border-border rounded-sm p-3 text-xs text-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-2">
                <button
                  type="button"
                  onClick={() => setViewingTask(null)}
                  className="h-9 px-4 border border-border text-text-accent text-xs rounded-sm hover:text-white hover:bg-input-background/50 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => setViewingTask(null)}
                  className="h-9 px-5 bg-red text-white text-xs font-medium rounded-sm hover:bg-red/90 transition-colors cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <form
            onSubmit={handleCreateTask}
            className="bg-card-background border border-border rounded-lg w-full px-6 py-4.5 max-w-md overflow-hidden text-white shadow-xl"
          >
            <div className="flex items-center justify-between pb-4">
              <span className="text-lg text-white">Создайте задачу</span>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-text-accent hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-accent uppercase">
                  Название задачи
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Введите название задачи..."
                  className="w-full h-10 bg-input-background border border-border rounded-sm px-3 text-xs text-white placeholder-text-accent outline-none focus:border-red/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-text-accent uppercase font-medium">
                    Тег
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full h-10 bg-input-background border border-border rounded-sm px-2 text-xs text-white outline-none focus:border-red/50 cursor-pointer"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Analytics">Аналитика</option>
                    <option value="Architecture">Архитектура</option>
                    <option value="Documentation">Документация</option>
                    <option value="Presentation">Презентация</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-text-accent uppercase font-medium">
                    Исполнитель
                  </label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className="w-full h-10 bg-input-background border border-border rounded-sm px-2 text-xs text-white outline-none focus:border-red/50 cursor-pointer"
                  >
                    <option value="">Не назначен</option>
                    {boardData.team_members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-text-accent uppercase font-medium">
                  Описание
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Добавьте описание задачи..."
                  className="w-full min-h-32 bg-input-background border border-border rounded-sm p-3 text-xs text-white placeholder-text-accent/40 outline-none focus:border-red/50 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4mt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-9 px-4 border border-border text-text-accent text-xs rounded-sm hover:text-white hover:bg-input-background/50 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 bg-red text-white text-xs font-medium rounded-sm hover:bg-red/90 transition-colors cursor-pointer"
                >
                  Создать
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
