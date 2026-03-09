import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-hover flex items-center justify-center mb-4">
        <Icon size={28} className="text-text-tertiary" />
      </div>
      <h3 className="text-[17px] font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-[15px] text-text-secondary max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-accent-blue text-white text-[15px] font-medium rounded-button hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
