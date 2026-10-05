import React, { useMemo } from 'react';
import { History, Trash2 } from 'lucide-react';
import { useStream } from '../context/StreamContext';
import { MediaItem, ActivePage } from '../types';
import { ContinueWatchingCard } from '../components/ContinueWatchingCard';
import { EmptyState } from '../components/EmptyState';

interface ContinueWatchingPageProps {
  onPlayMedia: (media: MediaItem, episodeId?: string, startSeconds?: number) => void;
  onNavigate: (page: ActivePage) => void;
}

export const ContinueWatchingPage: React.FC<ContinueWatchingPageProps> = ({
  onPlayMedia,
  onNavigate,
}) => {
  const { watchHistory, movies, tvShows, clearWatchHistory } = useStream();

  const allMedia: MediaItem[] = useMemo(() => {
    return [
      ...movies.map((m) => ({ ...m, type: 'movie' as const })),
      ...tvShows.map((s) => ({ ...s, type: 'tv' as const })),
    ];
  }, [movies, tvShows]);

  const historyItems = useMemo(() => {
    return watchHistory
      .map((hist) => {
        const media = allMedia.find((m) =>
          hist.movie_id ? m.id === hist.movie_id : m.id === hist.show_id
        );
        return media ? { hist, media } : null;
      })
      .filter((item): item is { hist: typeof watchHistory[0]; media: MediaItem } => item !== null);
  }, [watchHistory, allMedia]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Continue Watching
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Pick up right where you left off across all your devices
            </p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={() => clearWatchHistory()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-500/20 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watch History</span>
          </button>
        )}
      </div>

      {historyItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {historyItems.map(({ hist, media }) => (
            <ContinueWatchingCard
              key={hist.id}
              historyItem={hist}
              media={media}
              onResume={onPlayMedia}
              onRemove={clearWatchHistory}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="No watch history yet"
          description="Movies and series you stream will automatically appear here with your saved timestamp so you can jump right back in."
          actionText="Discover Movies"
          onAction={() => onNavigate('movies')}
        />
      )}
    </div>
  );
};
