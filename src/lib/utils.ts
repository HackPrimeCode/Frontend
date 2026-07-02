import type { HackathonStatus } from "@/features/hackathons/model/hackathonTypes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTotalRewards = (total_reward: number): string => {
  if (total_reward > 999999) {
    return "₽" + (total_reward / 1000000).toFixed(1) + "M";
  } else if (total_reward > 999) {
    return "₽" + Math.floor(total_reward / 1000) + "K";
  } else {
    return "₽" + total_reward;
  }
};

export const statusConfig: Record<
  HackathonStatus,
  { text: string; styles: string; dotColor: string }
> = {
  REGISTRATION: {
    text: "Предстоящий",
    styles: "bg-yellow/6 text-yellow border-yellow",
    dotColor: "bg-yellow",
  },
  IN_PROGRESS: {
    text: "Активный",
    styles: "bg-red/6 text-red border-red",
    dotColor: "bg-red",
  },
  FINISHED: {
    text: "Завершен",
    styles: "bg-text-accent/6 text-text-accent border-text-accent",
    dotColor: "bg-text-accent",
  },
  DRAFT: {
    text: "Черновик",
    styles: "bg-text-accent/5 text-text-accent/60 border-dashed border-border",
    dotColor: "bg-text-accent",
  },
};

export const calculateDurationHours = (
  start: string | null,
  end: string | null,
): number | null => {
  if (!start || !end) return null;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffMs = endTime - startTime;
  if (diffMs <= 0) return null;
  return Math.round(diffMs / (1000 * 60 * 60));
};

export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Дата не указана";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "2-digit",
  });
};
