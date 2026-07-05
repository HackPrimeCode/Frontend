import { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { useUpdateHackathonSpecificationMutation } from "@/features/organizer/api";

interface ConditionItem {
  id: string;
  value: string;
}

interface AccordionItemConfig {
  id: string;
  title: string;
  conditions: ConditionItem[];
}

interface OrganizerTaskSpecTabProps {
  hackathonId: number | null;
  initialData: {
    task_description: string | null;
    functional_requirements: string[] | null;
    technical_limitations: string[] | null;
    evaluation_criteria: string[] | null;
  } | null;
  taskName: string;
}

export default function OrganizerTaskSpecTab({ hackathonId, initialData, taskName }: OrganizerTaskSpecTabProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    functional: false,
    technical: false,
    criteria: false,
    requirements: false,
  });

  const [accordionData, setAccordionData] = useState<AccordionItemConfig[]>([
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
  const [taskDescription, setTaskDescription] = useState("");
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const [updateSpecification] = useUpdateHackathonSpecificationMutation();

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setTaskDescription(initialData.task_description || "");
      
      const newData = [...accordionData];
      
      if (initialData.functional_requirements && initialData.functional_requirements.length > 0) {
        const functionalIndex = newData.findIndex(item => item.id === "functional");
        if (functionalIndex !== -1) {
          newData[functionalIndex].conditions = initialData.functional_requirements.map((req, idx) => ({
            id: `functional-${idx}`,
            value: req
          }));
        }
      }
      
      if (initialData.technical_limitations && initialData.technical_limitations.length > 0) {
        const technicalIndex = newData.findIndex(item => item.id === "technical");
        if (technicalIndex !== -1) {
          newData[technicalIndex].conditions = initialData.technical_limitations.map((lim, idx) => ({
            id: `technical-${idx}`,
            value: lim
          }));
        }
      }
      
      if (initialData.evaluation_criteria && initialData.evaluation_criteria.length > 0) {
        const criteriaIndex = newData.findIndex(item => item.id === "criteria");
        if (criteriaIndex !== -1) {
          newData[criteriaIndex].conditions = initialData.evaluation_criteria.map((crit, idx) => ({
            id: `criteria-${idx}`,
            value: crit
          }));
        }
      }
      
      setAccordionData(newData);
    }
  }, [initialData]);

  const adjustTextareaHeight = (element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.max(40, element.scrollHeight)}px`;
  };

  useEffect(() => {
    Object.values(textareaRefs.current).forEach(adjustTextareaHeight);
  }, [tempConditions]);

  // Auto-save when data changes
  useEffect(() => {
    if (!hackathonId) return;

    const functional = accordionData.find(item => item.id === "functional")?.conditions.map(c => c.value) || [];
    const technical = accordionData.find(item => item.id === "technical")?.conditions.map(c => c.value) || [];
    const criteria = accordionData.find(item => item.id === "criteria")?.conditions.map(c => c.value) || [];
    const requirements = accordionData.find(item => item.id === "requirements")?.conditions.map(c => c.value) || [];

    // Debounce save
    const timeoutId = setTimeout(() => {
      updateSpecification({
        hackathonId,
        data: {
          task: taskName.trim(),
          task_description: taskDescription || null,
          functional_requirements: functional,
          technical_limitations: technical,
          evaluation_criteria: criteria,
          files: requirements,
        },
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [accordionData, taskDescription, hackathonId, taskName, updateSpecification]);

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
                    <textarea
                      ref={(element) => {
                        textareaRefs.current[id] = element;
                        adjustTextareaHeight(element);
                      }}
                      value={tempValue}
                      onChange={(e) => {
                        setTempConditions((prev) => ({
                          ...prev,
                          [id]: e.target.value,
                        }));
                      }}
                      onInput={(e) => adjustTextareaHeight(e.currentTarget)}
                      placeholder="Введите условие..."
                      rows={1}
                      className="min-h-10 max-h-40 w-full bg-input-background border border-border rounded-sm px-3 md:px-4 py-2 text-white placeholder:text-text-accent text-xs resize-none overflow-hidden"
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
