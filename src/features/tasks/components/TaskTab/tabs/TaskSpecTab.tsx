import type { HackathonDetailsWithTask } from "@/features/hackathons/model/hackathonTypes";
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

  const accordionConfig: AccordionItemConfig[] = [
    {
      id: "description",
      title: "Общее описание задачи",
      content: hackathon.task_description,
    },
    {
      id: "functional",
      title: "Функциональные требования",
      content: (
        <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white">
          {hackathon.functional_requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "technical",
      title: "Технические ограничения",
      content: (
        <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white">
          {hackathon.technical_limitations.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "criteria",
      title: "Критерии оценки",
      content: (
        <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white">
          {hackathon.evaluation_criteria.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "requirements",
      title: "Требования к сдаче",
      content: (
        <ul className="flex flex-col gap-2 text-xs md:text-[0.8125rem] text-white">
          {hackathon.submission_requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
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
