import React, { useState, useMemo } from 'react';
import { Play, Film, ArrowLeft, Star, Clock, Calendar, Check, Plus, Heart } from 'lucide-react';
import { MediaItem, Episode, Movie, TVShow } from '../types';
import { RatingBadge } from '../components/RatingBadge';
import { WatchlistButton } from '../components/WatchlistButton';
import { FavoriteButton } from '../components/FavoriteButton';
import { EpisodeCard } from '../components/EpisodeCard';
import { SeasonSelector } from '../components/SeasonSelector';
import { MovieCard } from '../components/MovieCard';
import { Modal } from '../components/Modal';
import { useStream } from '../context/StreamContext';
import { isYouTubeUrl } from '../lib/tmdb';

interface DetailsPageProps {
  media: MediaItem;
  onPlay: (media: MediaItem, episodeId?: string, startSeconds?: number) => void;
  onSelectMedia: (media: MediaItem) => void;
  onBack: () => void;
}

export const DetailsPage: React.FC<DetailsPageProps> = ({
  media,
  onPlay,
  onSelectMedia,
  onBack,
}) => {
  const { movies, tvShows } = useStream();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  const isTv = media.type === 'tv' || 'seasons' in media;
  const seasons = isTv && 'seasons' in media ? media.seasons : [];

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(() => {
    return seasons.length > 0 ? seasons[0].id : '';
  });

  const activeSeason = useMemo(() => {
    if (!seasons.length) return null;
    return seasons.find((s) => s.id === selectedSeasonId) || seasons[0];
  }, [seasons, selectedSeasonId]);

  // "More Like This" recommendations
  const recommendations = useMemo(() => {
    const currentGenre = media.genre.split(',')[0].trim().toLowerCase();
    const all = [
      ...movies.map((m) => ({ ...m, type: 'movie' as const })),
      ...tvShows.map((s) => ({ ...s, type: 'tv' as const })),
    ];

    return all
      .filter((item) => item.id !== media.id)
      .filter((item) => item.genre.toLowerCase().includes(currentGenre))
      .slice(0, 6);
  }, [media, movies, tvShows]);

  const trailerUrl =
    ('trailer_url' in media && media.trailer_url) ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  return (
    <div className="min-h-screen pb-24 text-slate-200">
      {/* Cinematic Header / Backdrop Banner */}
      <div className="relative w-full h-[65vh] min-h-[460px] max-h-[680px] bg-slate-950">
        <img
          src={media.backdrop_url || media.poster_url}
          alt={media.title}
          className="w-full h-full object-cover object-center"
        />

        {/* Backdrop Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-[#080a0f]/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-20 left-4 sm:left-8 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/60 transition-colors text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-40 sm:-mt-52 relative z-20 space-y-12">
        {/* Title, Poster & Meta Block */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
          {/* Vertical Poster Card */}
          <div className="w-44 sm:w-60 md:w-64 shrink-0 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl">
            <img
              src={media.poster_url}
              alt={media.title}
              className="w-full h-full object-cover aspect-[2/3]"
            />
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-4 pt-2">
            {/* Metadata Line */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {isTv ? 'TV SERIES' : 'FEATURE FILM'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{media.release_year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>
                {'runtime' in media ? `${media.runtime} minutes` : `${seasons.length} Seasons`}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-400 font-semibold">{media.genre}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <RatingBadge rating={media.rating} size="md" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
              {media.title}
            </h1>

            {/* Synopsis */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {media.description}
            </p>

            {/* Cast & Crew Information */}
            <div className="space-y-1 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/80">
              {'director' in media && media.director && (
                <p>
                  <span className="text-slate-500 font-semibold">Director: </span>
                  <span className="text-slate-300">{media.director}</span>
                </p>
              )}
              {media.cast_members && (
                <p>
                  <span className="text-slate-500 font-semibold">Cast: </span>
                  <span className="text-slate-300">{media.cast_members}</span>
                </p>
              )}
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-3 pt-4 flex-wrap">
              <button
                onClick={() => onPlay(media)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isTv ? 'Watch First Episode' : 'Watch Now'}</span>
              </button>

              <button
                onClick={() => setTrailerModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium text-sm sm:text-base border border-slate-700 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Film className="w-5 h-5 text-cyan-400" />
                <span>Trailer</span>
              </button>

              <WatchlistButton
                mediaId={media.id}
                type={isTv ? 'tv' : 'movie'}
                variant="labeled"
                className="py-3 px-5 text-sm sm:text-base"
              />

              <FavoriteButton
                mediaId={media.id}
                type={isTv ? 'tv' : 'movie'}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* TV Show Seasons & Episodes Section */}
        {isTv && activeSeason && (
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Episodes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select an episode to start streaming immediately
                </p>
              </div>

              <SeasonSelector
                seasons={seasons}
                selectedSeasonId={selectedSeasonId}
                onSelectSeason={setSelectedSeasonId}
              />
            </div>

            <div className="space-y-3">
              {activeSeason.episodes.map((episode) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  seasonNumber={activeSeason.season_number}
                  onPlay={() => onPlay(media, episode.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* "More Like This" Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-slate-800">
            <div>
              <h3 className="text-2xl font-bold font-display text-white">
                More Like This
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Recommended titles with similar genre and tone
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((rec) => (
                <MovieCard
                  key={rec.id}
                  media={rec}
                  onSelect={onSelectMedia}
                  onPlay={onPlay}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <Modal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={`${media.title} — Official Trailer`}
        maxWidth="max-w-4xl"
      >
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          {isYouTubeUrl(trailerUrl) ? (
            <iframe
              src={trailerUrl}
              title={`${media.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={trailerUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
