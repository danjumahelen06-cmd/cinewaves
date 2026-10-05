import React from 'react';
import { Heart } from 'lucide-react';
import { useStream } from '../context/StreamContext';

interface FavoriteButtonProps {
  mediaId: string;
  type: 'movie' | 'tv';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  mediaId,
  type,
  size = 'md',
  className = '',
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useStream();
  const favorited = isFavorite(mediaId, type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorited) {
      removeFromFavorites(mediaId, type);
    } else {
      addToFavorites(mediaId, type);
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
      title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
      className={`rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'
      } ${
        favorited
          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 hover:bg-rose-500/30'
          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/60'
      } ${className}`}
    >
      <Heart className={`${iconSize} ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
    </button>
  );
};
