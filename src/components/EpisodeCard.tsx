import React from 'react';
import { Play } from 'lucide-react';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
  seasonNumber: number;
  onPlay: (episode: Episode) => void;
  isActive?: boolean;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  seasonNumber,
  onPlay,
  isActive = false,
}) => {
  return (
    <div
      onClick={() => onPlay(episode)}
      className={`group flex flex-col sm:flex-row gap-4 p-3.5 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md'
          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Thumbnail Container (16:9) */}
      <div className="relative aspect-[16/9] w-full sm:w-48 sm:shrink-0 rounded-lg overflow-hidden bg-slate-950">
        <img
          src={episode.thumbnail_url}
          alt={episode.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-black/70 text-slate-200 backdrop-blur-sm tabular-nums">
          {episode.duration}m
        </div>
      </div>

      {/* Info Container */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-cyan-400 tabular-nums">
            EPISODE {episode.episode_number}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">Season {seasonNumber}</span>
        </div>
        <h4 className="font-semibold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
          {episode.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {episode.description}
        </p>
      </div>
    </div>
  );
};
