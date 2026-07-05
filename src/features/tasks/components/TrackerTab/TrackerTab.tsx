import { useState } from "react";
import { Plus, X, Eye, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentTeamId } from "@/features/auth/model/authSlice";
import { useGetTeamByIdQuery } from "@/features/team/api/teamApi";
import {
  useCreateTeamTaskMutation,
  useGetTeamTasksQuery,
  useUpdateTeamTaskMutation,
  useDeleteTeamTaskMutation,
} from "../../api/tasksApi";
import type { HackathonTaskRead, TaskStatus } from "../../model/taskTypes";

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

export default function TrackerTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeColumnForCreate, setActiveColumnForCreate] =
    useState<TaskStatus>("backlog");
  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssigneeId, setNewAssigneeId] = useState<number | null>(null);

  const [selectedTask, setSelectedTask] = useState<HackathonTaskRead | null>(
    null,
  );

  const [createTeamTask] = useCreateTeamTaskMutation();
  const [updateTeamTask] = useUpdateTeamTaskMutation();
  const [deleteTeamTask] = useDeleteTeamTaskMutation();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<TaskStatus | null>(
    null,
  );

  const teamId = useSelector(selectCurrentTeamId);
  const { data: team, isLoading: isTeamLoading } = useGetTeamByIdQuery(
    teamId!,
    {
      skip: !teamId,
    },
  );

  const { data: boardData, isLoading: isTasksLoading } = useGetTeamTasksQuery(
    teamId!,
    { skip: !teamId },
  );

  if (isTeamLoading || isTasksLoading) {
    return (
      <div className="text-white text-sm p-6">Загрузка таск-трекера...</div>
    );
  }

  if (!teamId) {
    return (
      <div className="text-text-accent text-sm p-6 text-center">
        Вы не состоите в команде. Создайте или вступите в команду, чтобы
        использовать трекер.
      </div>
    );
  }

  const columns = boardData?.tasks ?? {
    backlog: [],
    in_work: [],
    review: [],
    done: [],
  };
  const teamMembers = boardData?.team_members ?? [];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent, colType: TaskStatus) => {
    e.preventDefault();
    if (activeDropColumn !== colType) {
      setActiveDropColumn(colType);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;

    setDraggedTaskId(null);
    setActiveDropColumn(null);

    if (!taskId) return;

    try {
      await updateTeamTask({
        teamId,
        taskId,
        payload: { status: targetStatus },
      }).unwrap();
    } catch (err) {
      console.error("Ошибка при перемещении задачи:", err);
    }
  };

  const handleOpenCreate = (colType: TaskStatus) => {
    setActiveColumnForCreate(colType);
    setNewTitle("");
    setNewTag("");
    setNewDesc("");
    setNewAssigneeId(null);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const createdTask = await createTeamTask({
        teamId,
        payload: {
          title: newTitle,
          tag: newTag,
          description: newDesc,
          assignee_id: newAssigneeId,
        },
      }).unwrap();

      if (activeColumnForCreate !== "backlog") {
        await updateTeamTask({
          teamId,
          taskId: createdTask.id,
          payload: { status: activeColumnForCreate },
        }).unwrap();
      }

      setIsCreateOpen(false);
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 animate-fadeIn p-4.5">
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          <span>
            {team.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-white text-base font-medium">{team.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {(Object.keys(COLUMNS_CONFIG) as ColumnType[]).map((colType) => {
          const colTasks = columns[colType] || [];
          const config = COLUMNS_CONFIG[colType];

          return (
            <div
              key={colType}
              onDragOver={(e) => handleDragOver(e, colType)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, colType)}
              className="flex flex-col gap-3 lg:min-h-110 rounded-lg pb-6"
            >
              <div
                className={`flex items-center justify-between px-1 pb-3 border-b ${colType === "done" ? "border-red" : "border-border"}`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white">{config.title}</span>
                  <span className={config.countStyles}>{colTasks.length}</span>
                </div>
                <button
                  onClick={() => handleOpenCreate(colType)}
                  className="text-text-accent hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedTask(task)}
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
                            className={`w-5 h-5 rounded-full bg-red flex items-center justify-center text-[0.625rem] text-white font-bold shrink-0`}
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
                        onClick={() => {
                          setSelectedTask(task);
                        }}
                        className="text-text-accent hover:text-white p-1 rounded hover:bg-input-background/40 transition-colors cursor-pointer"
                        title="Просмотр задачи"
                      >
                        <Eye className="w-4 h-4 text-red" />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="border border-dashed border-text-accent rounded-lg py-10 text-center text-xs text-text-accent select-none">
                    Перетащите задачу сюда
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-card-background border border-border rounded-sm w-full px-6 py-4.5 max-w-md overflow-hidden text-white shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <span className="text-lg text-white">{selectedTask.title}</span>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
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
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
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
                  <div className="w-full h-10 bg-input-background border border-border rounded-sm px-3 flex items-center gap-2.5">
                    {selectedTask.assignee ? (
                      <>
                        <div
                          className={`w-5 h-5 rounded-full ${selectedTask.assignee.color} flex items-center justify-center text-[10px] text-white font-bold shrink-0`}
                        >
                          {selectedTask.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-xs text-white truncate">
                          {selectedTask.assignee.name}
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
                  value={selectedTask.description || "Описание отсутствует..."}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-32 bg-input-background border border-border rounded-sm p-3 text-xs text-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      console.log("TRY BETTER");
                      await deleteTeamTask({
                        teamId,
                        taskId: selectedTask.id,
                      }).unwrap();
                      setSelectedTask(null);
                    } catch (err) {
                      console.error("Ошибка при удалении задачи:", err);
                    }
                  }}
                  className="h-9 px-4 border border-border text-text-accent text-xs rounded-sm hover:text-white hover:bg-input-background/50 transition-colors cursor-pointer"
                >
                  <Trash className="text-red" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="h-9 px-4 border border-border text-text-accent text-xs rounded-sm hover:text-white hover:bg-input-background/50 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateTeamTask({
                        teamId,
                        taskId: selectedTask.id,
                        payload: {
                          title: selectedTask.title,
                          tag: selectedTask.tag,
                          description: selectedTask.description,
                        },
                      }).unwrap();
                      setSelectedTask(null);
                    } catch (err) {
                      console.error("Ошибка при обновлении задачи:", err);
                    }
                  }}
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
            onSubmit={handleCreateSubmit}
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
                    required
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full h-10 bg-input-background border border-border rounded-sm px-2 text-xs text-white outline-none focus:border-red/50 cursor-pointer"
                  >
                    <option value="" disabled hidden>
                      Выберите тег...
                    </option>
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
                    onChange={(e) =>
                      setNewAssigneeId(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full h-10 bg-input-background border border-border rounded-sm px-2 text-xs text-white outline-none focus:border-red/50 cursor-pointer"
                  >
                    <option value="">Не назначен</option>
                    {teamMembers.map((member) => (
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
