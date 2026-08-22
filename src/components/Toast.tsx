import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const { message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-teal-50 border-teal-200 text-teal-800',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />
    },
    info: {
      bg: 'bg-zinc-50 border-zinc-200 text-zinc-800',
      icon: <Info className="w-5 h-5 text-zinc-600" />
    }
  }[type] || {
    bg: 'bg-zinc-50 border-zinc-200 text-zinc-800',
    icon: <Info className="w-5 h-5 text-zinc-600" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-bounce-in max-w-sm w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-4 flex items-start space-x-3 transition-all duration-300 transform scale-100">
      <div className={`p-1 rounded-md ${styles.bg.split(' ')[0]}`}>
        {styles.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-900">{message}</p>
      </div>
    </div>
  );
};
