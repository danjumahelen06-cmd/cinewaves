import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import { MediaItem, Episode, ActivePage } from '../types';
import { useStream } from '../context/StreamContext';
import { MovieCard } from '../components/MovieCard';
import { RatingBadge } from '../components/RatingBadge';
import { WatchlistButton } from '../components/WatchlistButton';
import { FavoriteButton } from '../components/FavoriteButton';

interface PlayerPageProps {
  media: MediaItem;
  episodeId?: string;
  startSeconds?: number;
  onBack: () => void;
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem, epId?: string, startSec?: number) => void;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({
  media,
  episodeId,
  startSeconds = 0,
  onBack,
  onSelectMedia,
  onPlayMedia,
}) => {
  const { movies, tvShows } = useStream();

  const isTv = media.type === 'tv' || 'seasons' in media;

  // Resolve active episode & next episode if TV show
  const { currentEpisode, nextEpisode } = useMemo(() => {
    if (!isTv || !('seasons' in media) || !media.seasons.length) {
      return { currentEpisode: undefined, nextEpisode: undefined };
    }

    const allEpisodes: Episode[] = [];
    media.seasons.forEach((s) => allEpisodes.push(...s.episodes));

    let activeEp = allEpisodes[0];
    let nextEp: Episode | undefined;

    if (episodeId) {
      const idx = allEpisodes.findIndex((e) => e.id === episodeId);
      if (idx !== -1) {
        activeEp = allEpisodes[idx];
        nextEp = allEpisodes[idx + 1];
      }
    } else {
      nextEp = allEpisodes[1];
    }

    return { currentEpisode: activeEp, nextEpisode: nextEp };
  }, [media, isTv, episodeId]);

  // Recommended content
  const recommended = useMemo(() => {
    const genre = media.genre.split(',')[0].trim().toLowerCase();
    const all = [
      ...movies.map((m) => ({ ...m, type: 'movie' as const })),
      ...tvShows.map((s) => ({ ...s, type: 'tv' as const })),
    ];
    return all.filter((m) => m.id !== media.id && m.genre.toLowerCase().includes(genre)).slice(0, 6);
  }, [media, movies, tvShows]);

  const handlePlayNextEpisode = (ep: Episode) => {
    onPlayMedia(media, ep.id, 0);
  };

  return (
    <div className="pt-8 sm:pt-10 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-6 min-h-screen">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-semibold transition-all hover:border-cyan-500/50 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Browse</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">Now Streaming:</span>
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px] sm:max-w-md">{media.title}</span>
          <RatingBadge rating={media.rating} size="sm" />
        </div>
      </div>

      {/* Player Section */}
      <VideoPlayer
        media={media}
        episode={currentEpisode}
        nextEpisode={nextEpisode}
        startSeconds={startSeconds}
        onBack={onBack}
        onPlayNextEpisode={handlePlayNextEpisode}
      />

      {/* Under Player Content: Title, metadata, description */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-cyan-400 font-bold uppercase">{isTv ? 'SERIES' : 'MOVIE'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{media.release_year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{media.genre}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <RatingBadge rating={media.rating} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {media.title}
              {currentEpisode && (
                <span className="text-slate-400 text-lg sm:text-xl font-normal ml-2">
                  — Ep {currentEpisode.episode_number}: {currentEpisode.title}
                </span>
              )}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              {currentEpisode?.description || media.description}
            </p>

            <div className="text-xs text-slate-400 space-y-1 pt-2">
              {'director' in media && media.director && (
                <p>
                  <span className="text-slate-500 font-medium">Director: </span>
                  {media.director}
                </p>
              )}
              {media.cast_members && (
                <p>
                  <span className="text-slate-500 font-medium">Cast: </span>
                  {media.cast_members}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <WatchlistButton
              mediaId={media.id}
              type={isTv ? 'tv' : 'movie'}
              variant="labeled"
            />
            <FavoriteButton
              mediaId={media.id}
              type={isTv ? 'tv' : 'movie'}
              size="lg"
            />
          </div>
        </div>

        {/* Up Next / Episodes if TV */}
        {isTv && 'seasons' in media && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-white">
              More Episodes from {media.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {media.seasons.flatMap((s) => s.episodes).map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => onPlayMedia(media, ep.id, 0)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    ep.id === currentEpisode?.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-bold text-cyan-400">Episode {ep.episode_number}</p>
                    <p className="text-sm font-semibold truncate text-white">{ep.title}</p>
                  </div>
                  <span className="text-xs text-slate-400 tabular-nums shrink-0">{ep.duration}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended titles */}
        {recommended.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold font-display text-white">
              Recommended For You
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {recommended.map((item) => (
                <MovieCard
                  key={item.id}
                  media={item}
                  onSelect={onSelectMedia}
                  onPlay={(m) => onPlayMedia(m, undefined, 0)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
