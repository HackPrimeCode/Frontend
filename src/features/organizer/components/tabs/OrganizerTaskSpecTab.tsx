import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConditionItem {
  id: string;
  value: string;
}

interface AccordionItemConfig {
  id: string;
  title: string;
  conditions: ConditionItem[];
}

export default function OrganizerTaskSpecTab() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    functional: false,
    technical: false,
    criteria: false,
    requirements: false,
  });

  const [accordionData, setAccordionData] = useState<AccordionItemConfig[]>([
    {
      id: "description",
      title: "Общее описание задачи",
      conditions: [],
    },
    {
      id: "functional",
      title: "Функциональные требования",
      conditions: [],
    },
    {
      id: "technical",
      title: "Технические ограничения",
      conditions: [],
    },
    {
      id: "criteria",
      title: "Критерии оценки",
      conditions: [],
    },
    {
      id: "requirements",
      title: "Требования к сдаче",
      conditions: [],
    },
  ]);

  const [tempConditions, setTempConditions] = useState<Record<string, string>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddCondition = (sectionId: string) => {
    const newCondition: ConditionItem = {
      id: `${sectionId}-${Date.now()}`,
      value: tempConditions[sectionId] || "",
    };

    setAccordionData((prev) =>
      prev.map((item) =>
        item.id === sectionId
          ? { ...item, conditions: [...item.conditions, newCondition] }
          : item
      )
    );

    setTempConditions((prev) => ({ ...prev, [sectionId]: "" }));
  };

  const handleCancelCondition = (sectionId: string) => {
    setTempConditions((prev) => ({ ...prev, [sectionId]: "" }));
  };

  const handleDeleteCondition = (sectionId: string, conditionId: string) => {
    setAccordionData((prev) =>
      prev.map((item) =>
        item.id === sectionId
          ? {
              ...item,
              conditions: item.conditions.filter((c) => c.id !== conditionId),
            }
          : item
      )
    );
  };

  return (
    <div className="flex flex-col gap-3 animate-fadeIn">
      {accordionData.map(({ id, title, conditions }) => {
        const isOpen = !!openSections[id];
        const tempValue = tempConditions[id] || "";

        return (
          <div
            key={id}
            className="border border-border rounded-lg bg-card-background text-white overflow-hidden"
          >
            <button
              onClick={() => toggleSection(id)}
              className="w-full px-3 md:px-5 py-3 md:py-4 flex items-center justify-between text-xs md:text-sm hover:bg-input-background/60 transition-colors cursor-pointer text-left"
            >
              <span>{title}</span>
              <Plus className="w-3.5 h-3.5 text-text-accent shrink-0" />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] border-t border-border"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-3 md:px-5 py-3 md:py-4 text-xs text-white">
                  {conditions.length > 0 && (
                    <ul className="flex flex-col gap-2 mb-4">
                      {conditions.map((condition) => (
                        <li
                          key={condition.id}
                          className="flex items-start gap-2.5 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
                          <span className="flex-1 text-xs">{condition.value}</span>
                          <button
                            onClick={() => handleDeleteCondition(id, condition.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-text-accent hover:text-red cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col gap-2">
                    <Input
                      value={tempValue}
                      onChange={(e) =>
                        setTempConditions((prev) => ({
                          ...prev,
                          [id]: e.target.value,
                        }))
                      }
                      placeholder="Введите условие..."
                      className="h-10 bg-input-background border border-border rounded-sm px-3 md:px-4 text-white placeholder:text-text-accent text-xs"
                    />

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <button
                        onClick={() => handleCancelCondition(id)}
                        className="h-8 px-3 md:px-4 text-xs text-text-accent hover:text-white transition-colors cursor-pointer"
                      >
                        Отменить
                      </button>
                      <button
                        onClick={() => handleAddCondition(id)}
                        className="h-8 px-3 md:px-4 bg-red text-white text-xs rounded-sm hover:bg-red/90 transition-colors cursor-pointer"
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
