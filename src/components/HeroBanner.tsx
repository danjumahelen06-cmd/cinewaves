import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from '../types';
import { RatingBadge } from './RatingBadge';
import { WatchlistButton } from './WatchlistButton';

interface HeroBannerProps {
  featuredItems: MediaItem[];
  onPlay: (media: MediaItem) => void;
  onMoreInfo: (media: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredItems,
  onPlay,
  onMoreInfo,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const current = featuredItems[currentIndex] || featuredItems[0];

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  if (!current) return null;

  const isTv = current.type === 'tv' || 'seasons' in current;
  const runtimeDisplay = 'runtime' in current ? `${current.runtime} min` : `${(current.seasons?.length || 1)} Seasons`;

  return (
    <div className="relative w-full h-[80vh] min-h-[560px] max-h-[780px] overflow-hidden bg-[#080a0f] select-none">
      {/* Atmospheric Ambient Base */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#091122] via-[#070b14] to-[#020408]" />
      <div className="absolute top-10 left-12 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={current.backdrop_url || current.poster_url || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80'}
          alt={current.title}
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80';
          }}
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-100 animate-in fade-in"
        />

        {/* Sophisticated Multi-Layer Scrims for Text Legibility */}
        {/* Left-to-right gradient for desktop reading */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-[#080a0f]/80 to-transparent w-full md:w-3/4" />
        {/* Bottom fade to seamlessly blend with content rows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/30 to-transparent" />
        {/* Top vignette for navbar contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080a0f]/80 via-transparent to-transparent h-28" />
      </div>

      {/* Hero Content Container - Vertically Centered & Well-Spaced from Top */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-center pt-24 sm:pt-28 pb-12 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Unboxed Clean Metadata Row */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
            <span className="text-cyan-400 font-bold tracking-widest uppercase">CineWave Original</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{current.release_year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{runtimeDisplay}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{current.genre.split(',')[0]}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <RatingBadge rating={current.rating} size="sm" />
          </div>

          {/* Cinematic Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.08] text-balance drop-shadow-md">
            {current.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3 max-w-xl drop-shadow">
            {current.description}
          </p>

          {/* Cast Preview */}
          {current.cast_members && (
            <p className="text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Starring: </span>
              {current.cast_members}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 flex-wrap">
            <button
              onClick={() => onPlay(current)}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Watch Now</span>
            </button>

            <WatchlistButton
              mediaId={current.id}
              type={isTv ? 'tv' : 'movie'}
              variant="labeled"
              className="py-3 px-5 text-sm sm:text-base"
            />

            <button
              onClick={() => onMoreInfo(current)}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-sm sm:text-base backdrop-blur-md border border-slate-700/70 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <Info className="w-5 h-5 text-slate-300" />
              <span>More Info</span>
            </button>

            {/* Ambient Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-slate-700/50 backdrop-blur-md transition-colors"
              title={isMuted ? 'Unmute preview sound' : 'Mute preview sound'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Carousel Dot Navigation */}
      {featuredItems.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1))
            }
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center border border-slate-700/50 backdrop-blur-md transition-colors"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {featuredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-cyan-400'
                    : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
            }
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center border border-slate-700/50 backdrop-blur-md transition-colors"
            aria-label="Next feature"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
