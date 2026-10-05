import React from 'react';
import { Plus, Check } from 'lucide-react';
import { useStream } from '../context/StreamContext';

interface WatchlistButtonProps {
  mediaId: string;
  type: 'movie' | 'tv';
  variant?: 'icon' | 'labeled' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  mediaId,
  type,
  variant = 'icon',
  size = 'md',
  className = '',
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useStream();
  const inList = isInWatchlist(mediaId, type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inList) {
      removeFromWatchlist(mediaId, type);
    } else {
      addToWatchlist(mediaId, type);
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  if (variant === 'labeled') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
          inList
            ? 'bg-slate-800/90 text-cyan-400 border border-cyan-500/30 hover:bg-slate-800'
            : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 hover:border-white/30'
        } ${className}`}
        title={inList ? 'Remove from My List' : 'Add to My List'}
      >
        {inList ? <Check className={iconSize} /> : <Plus className={iconSize} />}
        <span>{inList ? 'In My List' : '+ My List'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={inList ? 'Remove from My List' : 'Add to My List'}
      title={inList ? 'Remove from My List' : 'Add to My List'}
      className={`rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'
      } ${
        inList
          ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60'
      } ${className}`}
    >
      {inList ? <Check className={iconSize} /> : <Plus className={iconSize} />}
    </button>
  );
};
