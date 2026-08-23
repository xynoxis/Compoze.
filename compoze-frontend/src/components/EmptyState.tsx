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
  icon = <HelpCircle className="w-8 h-8 text-primary" />,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-8 depth-panel border border-border-subtle/30 rounded-3xl ctrl-transition max-w-lg mx-auto my-6">
      <div className="p-4 search-recessed rounded-full mb-5 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-md mb-6 leading-relaxed font-sans">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 btn-primary-3d text-on-primary text-xs font-semibold rounded-full ctrl-transition cursor-pointer inline-flex items-center justify-center"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
