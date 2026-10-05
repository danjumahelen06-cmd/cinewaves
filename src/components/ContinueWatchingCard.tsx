import React from 'react';
import { Play, X } from 'lucide-react';
import { WatchHistoryItem, MediaItem } from '../types';

interface ContinueWatchingCardProps {
  historyItem: WatchHistoryItem;
  media: MediaItem;
  onResume: (media: MediaItem, episodeId?: string, startSeconds?: number) => void;
  onRemove: (historyId: string) => void;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({
  historyItem,
  media,
  onResume,
  onRemove,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef<number | null>(null);

  const duration = historyItem.duration_seconds || (('runtime' in media ? media.runtime : 45) * 60);
  const progress = historyItem.progress_seconds || 0;
  const progressPercent = Math.min(100, Math.max(5, (progress / (duration || 1)) * 100));

  const remainingSeconds = Math.max(0, duration - progress);
  const remainingMinutes = Math.round(remainingSeconds / 60);

  const previewVideoUrl =
    ('video_url' in media && media.video_url && !media.video_url.includes('commondatastorage') && !media.video_url.includes('youtube')
      ? media.video_url
      : '') ||
    ('trailer_url' in media && media.trailer_url && !media.trailer_url.includes('commondatastorage') && !media.trailer_url.includes('youtube')
      ? media.trailer_url
      : '') ||
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4';

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(true);
    }, 350);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  // If this is a TV show, check episode title
  let episodeTitle = '';
  if (media.type === 'tv' && 'seasons' in media && historyItem.episode_id) {
    for (const season of media.seasons) {
      const ep = season.episodes.find((e) => e.id === historyItem.episode_id);
      if (ep) {
        episodeTitle = `S${season.season_number}:E${ep.episode_number} ${ep.title}`;
        break;
      }
    }
  }

  return (
    <div
      onClick={() => onResume(media, historyItem.episode_id, progress)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-950/40 hover:shadow-2xl cursor-pointer flex flex-col"
    >
      {/* 16:9 Backdrop Container */}
      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
        {/* Live Hover Video Preview */}
        {isHovered && (
          <div className="absolute inset-0 z-10 bg-black animate-in fade-in duration-300">
            <video
              src={previewVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider shadow">
              Preview
            </div>
          </div>
        )}

        <img
          src={media.backdrop_url || media.poster_url}
          alt={media.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play Icon in center on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 transition-all duration-200 group-hover:scale-110">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(historyItem.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="Remove from Continue Watching"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Remaining Time Tag */}
        <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-slate-200 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
          {remainingMinutes > 0 ? `${remainingMinutes}m left` : 'Resume'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-r"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Title & Info */}
      <div className="p-3 bg-[#0a0d14] flex flex-col justify-between flex-1">
        <h4 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
          {media.title}
        </h4>
        {episodeTitle && (
          <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
            {episodeTitle}
          </p>
        )}
      </div>
    </div>
  );
};
