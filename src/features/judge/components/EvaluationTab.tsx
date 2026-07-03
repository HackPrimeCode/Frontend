import { useState } from "react";
import { Globe, Box, Star, ExternalLink } from "lucide-react";

interface Criterion {
  id: string;
  label: string;
  value: number;
}

const initialCriteria: Criterion[] = [
  { id: "idea", label: "Идея", value: 9 },
  { id: "implementation", label: "Реализация", value: 6 },
  { id: "design", label: "Дизайн", value: 7 },
  { id: "code_quality", label: "Качество кода", value: 5 },
];

const Slider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const percentage = (value / 10) * 100;

  return (
    <div className="relative h-1.5 w-full group cursor-pointer">
      <div className="absolute inset-0 bg-border rounded-full" />
      <div
        className="absolute inset-y-0 left-0 bg-red rounded-full"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red rounded-full border-2 border-background shadow-sm pointer-events-none"
        style={{ left: `calc(${percentage}% - 7px)` }}
      />
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default function EvaluationTab() {
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);

  const totalScore = (
    criteria.reduce((sum, c) => sum + c.value, 0) / criteria.length
  ).toFixed(1);

  const handleSliderChange = (id: string, newValue: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: newValue } : c)),
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn max-w-2xl w-full mx-22">
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-text-accent text-sm">#1</span>
            <span className="px-2.5 py-1.5 rounded border border-red bg-red/5 text-red text-xs">
              Ожидает оценки
            </span>
          </div>
          <h2 className="text-2xl text-white">ML Platform</h2>
          <p className="text-xs text-text-accent">
            // Команда ByteForce • HackPrimeCode Лето 2026
          </p>
        </div>

        <div className="bg-card-background border border-border rounded-lg p-4 flex flex-col items-center justify-center min-w-32.5">
          <span className="text-[10px] text-text-accent uppercase tracking-wider mb-1">
            Итоговый балл
          </span>
          <span className="text-3xl text-red leading-none mb-1">
            {totalScore}
          </span>
          <span className="text-xs text-text-accent">/ 10.0</span>
        </div>
      </div>
      <div className="bg-card-background border border-border rounded-lg p-5">
        <h3 className="text-[10px] text-text-accent uppercase tracking-wider mb-3">
          Описание
        </h3>
        <p className="text-sm text-white leading-relaxed">
          Платформа для анализа данных в реальном времени с использованием
          машинного обучения. Позволяет командам быстро обрабатывать большие
          датасеты и получать ключевые инсайты для принятия решений.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-card-background border border-border rounded-lg text-xs text-text-accent hover:text-white hover:border-text-accent/30 transition-colors">
          <img src="./send-project-github-icon.svg" className="w-4 h-4" />
          Репозиторий
          <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-card-background border border-border rounded-lg text-xs text-text-accent hover:text-white hover:border-text-accent/30 transition-colors">
          <Globe className="w-4 h-4" />
          Демо
          <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-card-background border border-border rounded-lg text-xs text-text-accent hover:text-white hover:border-text-accent/30 transition-colors">
          <Box className="w-4 h-4" />
          Презентация
          <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
        </button>
      </div>

      <div className="bg-card-background border border-border rounded-lg p-6">
        <h3 className="text-xs text-text-accent uppercase tracking-wider mb-8">
          // Критерии оценки
        </h3>

        <div className="flex flex-col gap-7">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{criterion.label}</span>
                <span className="text-lg text-red">{criterion.value}</span>
              </div>
              <Slider
                value={criterion.value}
                onChange={(val) => handleSliderChange(criterion.id, val)}
              />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-red hover:bg-red/90 text-white py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red/10">
        <Star className="w-4 h-4" />
        Сохранить оценку
      </button>
    </div>
  );
}
