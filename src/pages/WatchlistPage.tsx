import React, { useMemo } from 'react';
import { Bookmark, Film } from 'lucide-react';
import { useStream } from '../context/StreamContext';
import { MediaItem, ActivePage } from '../types';
import { MovieGrid } from '../components/MovieGrid';

interface WatchlistPageProps {
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem) => void;
  onNavigate: (page: ActivePage) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  onSelectMedia,
  onPlayMedia,
  onNavigate,
}) => {
  const { watchlist, movies, tvShows } = useStream();

  const watchlistItems: MediaItem[] = useMemo(() => {
    const list: MediaItem[] = [];
    for (const item of watchlist) {
      if (item.movie_id) {
        const found = movies.find((m) => m.id === item.movie_id);
        if (found) list.push({ ...found, type: 'movie' });
      } else if (item.show_id) {
        const found = tvShows.find((s) => s.id === item.show_id);
        if (found) list.push({ ...found, type: 'tv' });
      }
    }
    return list;
  }, [watchlist, movies, tvShows]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              My Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {watchlistItems.length} saved {watchlistItems.length === 1 ? 'title' : 'titles'} ready to stream
            </p>
          </div>
        </div>
      </div>

      <MovieGrid
        items={watchlistItems}
        onSelect={onSelectMedia}
        onPlay={onPlayMedia}
        emptyTitle="Your watchlist is empty"
        emptyDescription="Explore our movies and series catalog, then tap '+ My List' to save titles you want to watch later."
      />
    </div>
  );
};
