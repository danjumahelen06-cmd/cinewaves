import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useStream } from '../context/StreamContext';
import { MediaItem, ActivePage } from '../types';
import { MovieGrid } from '../components/MovieGrid';

interface FavoritesPageProps {
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem) => void;
  onNavigate: (page: ActivePage) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectMedia,
  onPlayMedia,
}) => {
  const { favorites, movies, tvShows } = useStream();

  const favoriteItems: MediaItem[] = useMemo(() => {
    const list: MediaItem[] = [];
    for (const item of favorites) {
      if (item.movie_id) {
        const found = movies.find((m) => m.id === item.movie_id);
        if (found) list.push({ ...found, type: 'movie' });
      } else if (item.show_id) {
        const found = tvShows.find((s) => s.id === item.show_id);
        if (found) list.push({ ...found, type: 'tv' });
      }
    }
    return list;
  }, [favorites, movies, tvShows]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Favorite Titles
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {favoriteItems.length} personal {favoriteItems.length === 1 ? 'favorite' : 'favorites'}
            </p>
          </div>
        </div>
      </div>

      <MovieGrid
        items={favoriteItems}
        onSelect={onSelectMedia}
        onPlay={onPlayMedia}
        emptyTitle="No favorite titles yet"
        emptyDescription="Tap the heart icon on any movie or series to keep your all-time favorites right here."
      />
    </div>
  );
};
