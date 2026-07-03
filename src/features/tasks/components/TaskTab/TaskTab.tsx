import { useState } from "react";
import { Calendar, Users, FileCheck } from "lucide-react";
import TaskSpecTab from "./tabs/TaskSpecTab";
import TaskFilesTab from "./tabs/TaskFilesTab";
import type { HackathonDetailsWithTask } from "@/features/hackathons/model/hackathonTypes";
import { formatDate } from "@/lib/utils";
import { useCountdown } from "@/lib/hooks/useCountdown";

// Тестовые данные строго по макету
export const mockHackathon: HackathonDetailsWithTask = {
  id: 101010,
  title: "HackPrimeCode Лето 2026",
  description:
    "Флагманский хакатон от платформы. 48 часов интенсивной командной работы над реальными задачами от наших партнёров. Создавайте инновационные решения, получайте ценный опыт и выигрывайте крупные денежные призы.",
  status: "IN_PROGRESS",
  event_location: "Moscow",
  prizes: [
    { id: 1, title: "1-е место", reward: "300000" },
    { id: 2, title: "2-е место", reward: "150000" },
    { id: 3, title: "3-е место", reward: "50000" },
  ],
  topics: ["ML", "Python", "React", "Go"],
  min_team_size: 1,
  max_team_size: 4,
  max_participants: 1000,
  total_participants: 676,
  total_teams: 67,
  start_date: "2026-07-01T18:00:00",
  end_date: "2026-07-12T12:00:00",
  task: "Умный AI-мерчандайзер и персональный шопер",
  task_description:
    "Участникам предстоит создать прототип интеллектуальной мультимодальной системы для физических магазинов, которая стирает границу между онлайн и офлайн-шопингом. Цель проекта — объединить зрение, язык и алгоритмы рекомендаций в единый контур, способный в режиме реального времени понимать контекст покупателя у полки и мгновенно предлагать ему лучший пользовательский опыт.",
  functional_requirements: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
    "Наличие GitHub аккаунта",
    "Готовность работать 48 часов",
  ],
  technical_limitations: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
    "Наличие GitHub аккаунта",
    "Готовность работать 48 часов",
  ],
  evaluation_criteria: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
    "Наличие GitHub аккаунта",
    "Готовность работать 48 часов",
  ],
  submission_requirements: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
    "Наличие GitHub аккаунта",
    "Готовность работать 48 часов",
  ],
  files: [
    { name: "task_specification.pdf", size: "1.2 MB" },
    { name: "starter_template.zip", size: "4.7 MB" },
    { name: "api_schema.json", size: "84 KB" },
    { name: "dataset.csv", size: "230 KB" },
  ],
};

type ContentTab = "spec" | "files";

export default function TaskTab() {
  const [activeContentTab, setActiveContentTab] = useState<ContentTab>("spec");
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    mockHackathon.end_date,
  );

  const timeBlocks = [
    { value: days, label: "Дни" },
    { value: hours, label: "Час" },
    { value: minutes, label: "Мин" },
    { value: seconds, label: "Сек" },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      <div className="px-4.5 py-2">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex gap-4 min-h-14.5 md:h-14.5 items-center min-w-0">
            <div className="h-12 w-12 bg-red/6 border border-red rounded-lg flex items-center justify-center shrink-0">
              <FileCheck className="w-6.5 h-6.5 text-red" />
            </div>
            <div className="flex flex-col justify-between gap-2 md:gap-1 min-w-0">
              <h3 className="text-lg font-medium text-white truncate">
                {mockHackathon.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-text-accent">
                <div className="flex flex-wrap items-center gap-2">
                  {mockHackathon.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-input-background border border-border rounded text-xs text-text-accent font-medium whitespace-nowrap"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-red" />
                  <div>
                    <p>
                      {formatDate(mockHackathon.start_date)} —{" "}
                      {formatDate(mockHackathon.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 text-red" />
                  <span>
                    {mockHackathon.total_participants} /{" "}
                    {mockHackathon.max_participants} участников
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-1 items-end bg-input-background border border-red rounded-lg px-3.5 py-2 min-w-30 shrink-0">
            <p className="text-text-accent text-sm uppercase">Дедлайн</p>
            <div className="flex items-center">
              {isExpired ? (
                <span className="text-red text-xs">Время充ело!</span>
              ) : (
                timeBlocks.map((block, index) => (
                  <div key={index} className="flex text-red">
                    <div>
                      <p>{block.value}</p>
                      <p className="text-[0.625rem]">{block.label}</p>
                    </div>

                    {index < timeBlocks.length - 1 && <span>:</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex bg-card-background border border-border p-1 rounded-lg w-full sm:w-fit text-white text-xs mb-4">
          <button
            onClick={() => setActiveContentTab("spec")}
            className={`flex-1 sm:flex-none h-8 px-4 rounded-md transition-all cursor-pointer font-medium ${
              activeContentTab === "spec" && "bg-red"
            }`}
          >
            Техническое задание
          </button>
          <button
            onClick={() => setActiveContentTab("files")}
            className={`flex-1 sm:flex-none h-8 px-4 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium ${
              activeContentTab === "files"
                ? "bg-red text-white"
                : "text-text-accent hover:text-white"
            }`}
          >
            <span>Файлы задания</span>
            <span className="text-xs px-1.5 py-0.5 rounded-md text-white bg-white/20">
              {mockHackathon.files.length}
            </span>
          </button>
        </div>

        <div className="w-full">
          {activeContentTab === "spec" ? (
            <TaskSpecTab hackathon={mockHackathon} />
          ) : (
            <TaskFilesTab files={mockHackathon.files} />
          )}
        </div>
      </div>
    </div>
  );
}
