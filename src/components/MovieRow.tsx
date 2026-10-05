import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  onSelect: (media: MediaItem) => void;
  onPlay: (media: MediaItem) => void;
  onViewAll?: () => void;
  subtitle?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  items,
  onSelect,
  onPlay,
  onViewAll,
  subtitle,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/row py-4">
      {/* Row Header */}
      <div className="flex items-baseline justify-between px-4 sm:px-8 mb-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Relative Carousel Container with Navigation Buttons */}
      <div className="relative px-4 sm:px-8">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl opacity-0 group-hover/row:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[145px] sm:w-[190px] md:w-[220px] shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <MovieCard media={item} onSelect={onSelect} onPlay={onPlay} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl opacity-0 group-hover/row:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
