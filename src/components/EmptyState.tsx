import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <HelpCircle className="w-10 h-10 text-zinc-350 text-zinc-400" />,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
      <div className="p-3 bg-white rounded-full shadow-sm mb-4 border border-zinc-100">
        {icon}
      </div>
      <h3 className="text-base font-bold text-zinc-900 mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold rounded-full shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
