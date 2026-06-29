interface StatItem {
  value: string | number;
  label: string;
}

interface HeroStatsProps {
  stats: StatItem[];
}

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="w-full max-w-132 mx-auto grid grid-cols-2 md:grid-cols-[auto_auto_auto_auto] gap-px bg-border border border-border rounded-lg overflow-hidden">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-input-background flex flex-col items-center justify-center px-4 py-3"
        >
          <span className="text-[1.75rem] text-red">{stat.value}</span>
          <span className="text-xs text-text-accent uppercase text-center">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
