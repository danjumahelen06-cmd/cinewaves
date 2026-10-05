import React, { ReactNode } from 'react';
import { Film } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 my-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
        {icon || <Film className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold font-display text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
