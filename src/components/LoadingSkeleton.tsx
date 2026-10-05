import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="relative aspect-[2/3] w-full rounded-xl bg-slate-850/60 overflow-hidden animate-pulse border border-slate-800/40">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-4 bg-slate-750 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[480px] bg-slate-900/80 animate-pulse flex flex-col justify-end p-8 sm:p-16 border-b border-slate-800">
      <div className="space-y-4 max-w-xl">
        <div className="h-4 w-32 bg-slate-800 rounded" />
        <div className="h-12 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-full bg-slate-800 rounded" />
        <div className="h-4 w-5/6 bg-slate-800 rounded" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-36 bg-slate-750 rounded-xl" />
          <div className="h-12 w-36 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
