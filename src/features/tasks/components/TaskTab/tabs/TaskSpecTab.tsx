import type { HackathonDetailsWithTask } from "@/features/hackathons/model/hackathonTypes";
import { BarChart3, ClipboardList, ShieldAlert } from "lucide-react";
import { useState, type ReactNode } from "react";

interface TaskSpecTabProps {
  hackathon: HackathonDetailsWithTask;
}

interface AccordionItemConfig {
  id: string;
  title: string;
  content: ReactNode;
}

export default function TaskSpecTab({ hackathon }: TaskSpecTabProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    functional: false,
    technical: false,
    criteria: false,
    requirements: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const EmptySection = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2 text-text-accent/50 py-2 italic font-normal">
      <span>{text}</span>
    </div>
  );

  const accordionConfig: AccordionItemConfig[] = [
    {
      id: "description",
      title: "Общее описание задачи",
      content: hackathon.task_description ? (
        hackathon.task_description
      ) : (
        <EmptySection text="Описание задачи не предоставлено организаторами." />
      ),
    },
    {
      id: "functional",
      title: "Функциональные требования",
      content:
        hackathon.functional_requirements &&
        hackathon.functional_requirements.length > 0 ? (
          <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white list-none pl-0">
            {hackathon.functional_requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-red mt-0.5 shrink-0">•</span>
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySection text="Функциональные требования не указаны." />
        ),
    },
    {
      id: "technical",
      title: "Технические ограничения",
      content:
        hackathon.technical_limitations &&
        hackathon.technical_limitations.length > 0 ? (
          <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white list-none pl-0">
            {hackathon.technical_limitations.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red mt-0.5 shrink-0" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySection text="Особые технические ограничения отсутствуют." />
        ),
    },
    {
      id: "criteria",
      title: "Критерии оценки",
      content:
        hackathon.evaluation_criteria &&
        hackathon.evaluation_criteria.length > 0 ? (
          <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white list-none pl-0">
            {hackathon.evaluation_criteria.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <BarChart3 className="w-3.5 h-3.5 text-red mt-0.5 shrink-0" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySection text="Критерии оценки будут добавлены позже." />
        ),
    },
    {
      id: "requirements",
      title: "Требования к сдаче проекта",
      content:
        hackathon.submission_requirements &&
        hackathon.submission_requirements.length > 0 ? (
          <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white list-none pl-0">
            {hackathon.submission_requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <ClipboardList className="w-3.5 h-3.5 text-red mt-0.5 shrink-0" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySection text="Специфические требования к сдаче отсутствуют." />
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 animate-fadeIn w-full">
      {accordionConfig.map(({ id, title, content }) => {
        const isOpen = !!openSections[id];

        return (
          <div
            key={id}
            className="border border-border rounded-lg bg-card-background text-white overflow-hidden w-full"
          >
            <button
              onClick={() => toggleSection(id)}
              className="w-full px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between hover:bg-input-background/60 transition-colors cursor-pointer text-left gap-3 text-xs sm:text-sm font-medium"
            >
              <span>{title}</span>
              <img
                src="./dropdown-icon.svg"
                className={`w-3.5 h-3.5 text-text-accent shrink-0 transition-transform duration-400 ${
                  isOpen ? "-rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] border-t border-border"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 py-3 sm:px-5 sm:py-4 text-xs md:text-[0.8125rem] text-[#d1d1d6] leading-relaxed">
                  {content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
