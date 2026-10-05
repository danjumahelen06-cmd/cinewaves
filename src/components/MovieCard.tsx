import React, { useState } from 'react';
import { Play, Info } from 'lucide-react';
import { MediaItem } from '../types';
import { RatingBadge } from './RatingBadge';
import { WatchlistButton } from './WatchlistButton';
import { FavoriteButton } from './FavoriteButton';

interface MovieCardProps {
  media: MediaItem;
  onSelect: (media: MediaItem) => void;
  onPlay: (media: MediaItem) => void;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  media,
  onSelect,
  onPlay,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const isTv = media.type === 'tv' || 'seasons' in media;
  const mediaType = isTv ? 'tv' : 'movie';

  return (
    <div
      onClick={() => onSelect(media)}
      className={`group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-cyan-500/40 hover:shadow-cyan-950/40 hover:shadow-2xl flex flex-col ${className}`}
    >
      {/* Poster Aspect Container (2:3) */}
      <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
        {!imageError && media.poster_url ? (
          <img
            src={media.poster_url}
            alt={media.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-end p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950">
            <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              {media.genre}
            </span>
            <span className="text-white font-bold text-base leading-tight font-display">
              {media.title}
            </span>
          </div>
        )}

        {/* Subtle Dark Gradient Overlay at base of poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges: Media Type & Rating */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/20">
            {isTv ? 'SERIES' : 'MOVIE'}
          </span>
          <div className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-slate-700/50">
            <RatingBadge rating={media.rating} size="sm" />
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-center items-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(media);
            }}
            className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-cyan-500/30 cursor-pointer"
            aria-label={`Play ${media.title}`}
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>

          <div className="flex items-center gap-2 mt-1">
            <WatchlistButton mediaId={media.id} type={mediaType} size="sm" />
            <FavoriteButton mediaId={media.id} type={mediaType} size="sm" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(media);
              }}
              className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
              title="More details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3 bg-[#0a0d14] flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-sm text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
            {media.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{media.release_year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate max-w-[120px]">{media.genre.split(',')[0]}</span>
            {isTv && 'seasons' in media && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-cyan-400/90 font-medium">
                  {media.seasons.length} {media.seasons.length === 1 ? 'Season' : 'Seasons'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
