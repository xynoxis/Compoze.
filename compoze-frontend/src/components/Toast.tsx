import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const { message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-primary/10 border-primary/20 text-primary',
      icon: <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
    },
    info: {
      bg: 'bg-primary/10 border-primary/20 text-primary',
      icon: <Info className="w-5 h-5 text-primary flex-shrink-0" />
    }
  }[type] || {
    bg: 'bg-primary/10 border-primary/20 text-primary',
    icon: <Info className="w-5 h-5 text-primary flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-modal-enter max-w-sm w-full depth-panel border border-border-subtle/30 rounded-2xl p-4 flex items-center space-x-3.5 ctrl-transition shadow-2xl">
      <div className={`p-2 rounded-xl search-recessed flex items-center justify-center ${styles.bg}`}>
        {styles.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-on-surface leading-snug">{message}</p>
      </div>
    </div>
  );
};
