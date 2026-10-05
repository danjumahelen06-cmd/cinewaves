import React, { useState } from 'react';
import { MediaItem } from '../types';
import { MovieCard } from './MovieCard';
import { EmptyState } from './EmptyState';
import { Film } from 'lucide-react';

interface MovieGridProps {
  items: MediaItem[];
  onSelect: (media: MediaItem) => void;
  onPlay: (media: MediaItem) => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  items,
  onSelect,
  onPlay,
  pageSize = 18,
  emptyTitle = 'No titles found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Film className="w-8 h-8" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Responsive Grid: 2 mobile, 3-4 tablet, 6 desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {visibleItems.map((item) => (
          <MovieCard
            key={item.id}
            media={item}
            onSelect={onSelect}
            onPlay={onPlay}
          />
        ))}
      </div>

      {/* Pagination / Load More */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-6 gap-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + pageSize)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/80 transition-all hover:scale-105 cursor-pointer shadow-lg"
          >
            Load More Titles ({items.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
