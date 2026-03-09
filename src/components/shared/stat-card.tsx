import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: { value: string; positive: boolean } | null;
  color?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, trend, color = '#007AFF', icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-card p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-text-secondary">{label}</span>
        {icon && <div style={{ color }}>{icon}</div>}
      </div>
      <div className="font-mono text-[22px] font-bold text-text-primary">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-[12px] font-medium ${trend.positive ? 'text-accent-green' : 'text-accent-red'}`}>
          {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
