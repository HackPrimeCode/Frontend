import { useCountdown } from "@/lib/hooks/useCountdown";

interface DeadlineTimerProps {
  targetDate: string | null | undefined;
  onExpired?: () => void;
}

export default function DeadlineTimer({
  targetDate,
  onExpired,
}: DeadlineTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    onExpired?.();
    return (
      <span className="text-red text-sm tracking-wide">Время истекло!</span>
    );
  }

  const timeBlocks = [
    { value: days, label: "Дни" },
    { value: hours, label: "Час" },
    { value: minutes, label: "Мин" },
    { value: seconds, label: "Сек" },
  ];

  return (
    <div className="flex items-center gap-2">
      {timeBlocks.map((block, index) => (
        <div key={index} className="flex text-red">
          <div>
            <p>{block.value}</p>
            <p className="text-sm">{block.label}</p>
          </div>

          {index < timeBlocks.length - 1 && <span>:</span>}
        </div>
      ))}
    </div>
  );
}
