import type { PropertiesResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Flame, Eye, DollarSign } from "lucide-react";

interface StatsBarProps {
  data: PropertiesResponse;
}

export default function StatsBar({ data }: StatsBarProps) {
  const totalValue = data.properties.reduce(
    (sum, p) => sum + p.estimatedValue,
    0
  );

  const stats = [
    {
      label: "Properties Analysed",
      value: data.total.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "High Confidence",
      value: data.highConfidence.toLocaleString(),
      icon: Flame,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Avg Likeliness Score",
      value: `${data.averageScore}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Portfolio Value",
      value: formatCurrency(totalValue, true),
      icon: DollarSign,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 py-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium leading-none">
                {s.label}
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1 tracking-tight">
                {s.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
