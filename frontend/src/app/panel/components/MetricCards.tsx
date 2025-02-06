import { ChevronRight } from "lucide-react";

interface MetricCardProps {
  number: number;
  label: string;
  color: "indigo" | "emerald" | "blue";
}

export function MetricCard({ number, label, color }: MetricCardProps) {
  const colorClasses = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl font-bold mb-1">{number}</div>
          <div className="text-sm opacity-90">{label}</div>
        </div>
        <ChevronRight className="w-6 h-6 opacity-75" />
      </div>
    </div>
  );
}
