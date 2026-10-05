import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Subtitles,
  ArrowLeft,
  SkipForward,
  Gauge,
  Sliders,
} from 'lucide-react';
import { MediaItem, Episode } from '../types';
import { useStream } from '../context/StreamContext';
import { isYouTubeUrl } from '../lib/tmdb';

interface VideoPlayerProps {
  media: MediaItem;
  episode?: Episode;
  nextEpisode?: Episode;
  startSeconds?: number;
  onBack: () => void;
  onPlayNextEpisode?: (ep: Episode) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  media,
  episode,
  nextEpisode,
  startSeconds = 0,
  onBack,
  onPlayNextEpisode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const { recordWatchProgress } = useStream();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Active video source
  const videoUrl =
    episode?.video_url ||
    ('video_url' in media ? media.video_url : '') ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  const isTv = media.type === 'tv' || 'seasons' in media;

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Autohide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
      }
    }, 3500);
  };

  // Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => console.error('Play failed:', err));
    } else {
      videoRef.current.pause();
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Skip
  const skip = (delta: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
  };

  // Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error('Fullscreen err:', err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error('Exit fullscreen err:', err));
      setIsFullscreen(false);
    }
  };

  // Picture in picture
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not supported or failed:', err);
    }
  };

  // Speed
  const handleSetSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Save progress periodically and on unmount
  const saveProgress = useCallback(() => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    if (curr > 3) {
      recordWatchProgress(
        media.id,
        isTv ? 'tv' : 'movie',
        episode?.id,
        curr,
        dur
      );
    }
  }, [media.id, isTv, episode?.id, recordWatchProgress]);

  // Initial resume jump
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleLoadedMetadata = () => {
      setDuration(vid.duration);
      if (startSeconds > 0 && startSeconds < vid.duration - 5) {
        vid.currentTime = startSeconds;
      }
      setIsBuffering(false);
      vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    vid.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      vid.removeEventListener('loadedmetadata', handleLoadedMetadata);
      saveProgress();
    };
  }, [videoUrl, startSeconds, saveProgress]);

  // Periodic progress saving (every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        saveProgress();
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [isPlaying, saveProgress]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.min(1, volume + 0.1);
            setVolume(nextVol);
            videoRef.current.volume = nextVol;
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.max(0, volume - 0.1);
            setVolume(nextVol);
            videoRef.current.volume = nextVol;
          }
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          if (!document.fullscreenElement) {
            onBack();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isPlaying, onBack]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const isYouTube = isYouTubeUrl(videoUrl);

  if (isYouTube) {
    return (
      <div
        ref={containerRef}
        className="relative w-full aspect-video max-h-[88vh] bg-black overflow-hidden select-none rounded-2xl shadow-2xl border border-slate-800"
      >
        {/* YouTube Video Embed */}
        <iframe
          src={videoUrl}
          title={media.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Top Floating Control Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-auto z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                saveProgress();
                onBack();
              }}
              className="p-2 rounded-full bg-black/70 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/60 transition-colors cursor-pointer shadow-lg"
              aria-label="Back to details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg font-display drop-shadow">
                {media.title}
              </h2>
              {episode && (
                <p className="text-xs text-cyan-400 font-medium">
                  Episode {episode.episode_number}: {episode.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {nextEpisode && onPlayNextEpisode && (
              <button
                onClick={() => onPlayNextEpisode(nextEpisode)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Next Episode</span>
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            )}
            <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              TMDB 1080P HD
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video max-h-[88vh] bg-black overflow-hidden select-none group/player flex items-center justify-center rounded-2xl shadow-2xl border border-slate-800"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false);
          saveProgress();
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        playsInline
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
        </div>
      )}

      {/* Simulated CC Subtitles Overlay */}
      {subtitlesEnabled && isPlaying && currentTime > 3 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-white font-medium text-xs sm:text-sm text-center max-w-lg pointer-events-none shadow-lg border border-white/10">
          {currentTime < 8
            ? `[Audio track: Dolby Atmos English Original]`
            : currentTime < 25
            ? `“Our transmission was verified across all orbital repeaters.”`
            : currentTime < 45
            ? `“Prepare the atmospheric shields. We enter the horizon now.”`
            : `“Signal locked. Establishing jump coordinates.”`}
        </div>
      )}

      {/* Top Bar Overlay: Back Button, Title, Quality Tag */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              saveProgress();
              onBack();
            }}
            className="p-2 rounded-full bg-black/60 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/60 transition-colors cursor-pointer"
            aria-label="Back to details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-white font-bold text-base sm:text-lg font-display drop-shadow">
              {media.title}
            </h2>
            {episode && (
              <p className="text-xs text-cyan-400 font-medium">
                Episode {episode.episode_number}: {episode.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            4K UHD · DOLBY ATMOS
          </span>
        </div>
      </div>

      {/* Center Big Play Pause Flash on toggle */}
      {!isPlaying && !isBuffering && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          aria-label="Play video"
        >
          <div className="w-20 h-20 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-10 h-10 fill-current ml-1" />
          </div>
        </button>
      )}

      {/* Bottom Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Timeline Slider / Progress Bar */}
        <div className="relative mb-3 group/timeline cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer focus:outline-none accent-cyan-400 group-hover/timeline:h-2.5 transition-all"
          />
          {/* Progress fill highlight */}
          <div
            className="absolute top-0 left-0 h-1.5 group-hover/timeline:h-2.5 bg-cyan-400 rounded-l pointer-events-none transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3 text-white">
          {/* Left Controls: Play, Skip, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            {/* Skip back 10s */}
            <button
              onClick={() => skip(-10)}
              className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rewind 10s"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Skip forward 10s */}
            <button
              onClick={() => skip(10)}
              className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Fast forward 10s"
              aria-label="Fast forward 10 seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-cyan-400"
                aria-label="Volume slider"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs text-slate-300 font-mono tabular-nums hidden sm:block">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Next Episode, Subtitles, Speed, PiP, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Next Episode Button */}
            {nextEpisode && onPlayNextEpisode && (
              <button
                onClick={() => onPlayNextEpisode(nextEpisode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-semibold border border-cyan-500/30 transition-all cursor-pointer"
                title={`Next: Ep ${nextEpisode.episode_number} ${nextEpisode.title}`}
              >
                <SkipForward className="w-4 h-4" />
                <span className="hidden sm:inline">Next Episode</span>
              </button>
            )}

            {/* Subtitles Toggle */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                subtitlesEnabled ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Closed Captions (CC)"
              aria-label="Toggle subtitles"
            >
              <Subtitles className="w-5 h-5" />
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 text-xs font-mono rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-9 right-0 bg-[#0d1117] border border-slate-800 rounded-xl p-1 shadow-2xl flex flex-col gap-1 z-40 text-xs min-w-[70px]">
                  {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSetSpeed(spd)}
                      className={`px-3 py-1 rounded text-center transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              className="p-1.5 text-slate-400 hover:text-white transition-colors hidden sm:block cursor-pointer"
              title="Picture in Picture"
              aria-label="Picture in Picture"
            >
              <Sliders className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fullscreen"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
