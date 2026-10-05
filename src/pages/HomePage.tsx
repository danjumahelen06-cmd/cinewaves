import React, { useMemo } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { ContinueWatchingCard } from '../components/ContinueWatchingCard';
import { useStream } from '../context/StreamContext';
import { MediaItem, ActivePage } from '../types';
import { History, Sparkles } from 'lucide-react';

interface HomePageProps {
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem, episodeId?: string, startSeconds?: number) => void;
  onNavigate: (page: ActivePage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMedia,
  onPlayMedia,
  onNavigate,
}) => {
  const { movies, tvShows, watchHistory, clearWatchHistory } = useStream();

  // Combine items
  const allMedia: MediaItem[] = useMemo(() => {
    return [
      ...movies.map((m) => ({ ...m, type: 'movie' as const })),
      ...tvShows.map((s) => ({ ...s, type: 'tv' as const })),
    ];
  }, [movies, tvShows]);

  // Featured items for Hero Carousel
  const featuredItems = useMemo(() => {
    const feat = allMedia.filter((m) => m.featured);
    return feat.length > 0 ? feat : allMedia.slice(0, 4);
  }, [allMedia]);

  // Trending (highest rating)
  const trendingNow = useMemo(() => {
    return [...allMedia].sort((a, b) => b.rating - a.rating).slice(0, 12);
  }, [allMedia]);

  // Popular Movies
  const popularMovies = useMemo(() => {
    return movies.map((m) => ({ ...m, type: 'movie' as const })).slice(0, 12);
  }, [movies]);

  // Popular TV Shows
  const popularShows = useMemo(() => {
    return tvShows.map((s) => ({ ...s, type: 'tv' as const })).slice(0, 10);
  }, [tvShows]);

  // New Releases (latest year)
  const newReleases = useMemo(() => {
    return [...allMedia].sort((a, b) => b.release_year - a.release_year).slice(0, 12);
  }, [allMedia]);

  // Genre rows
  const sciFiMedia = useMemo(() => {
    return allMedia.filter((m) => m.genre.toLowerCase().includes('sci-fi'));
  }, [allMedia]);

  const actionMedia = useMemo(() => {
    return allMedia.filter((m) => m.genre.toLowerCase().includes('action'));
  }, [allMedia]);

  const thrillerMedia = useMemo(() => {
    return allMedia.filter((m) => m.genre.toLowerCase().includes('thriller'));
  }, [allMedia]);

  const dramaMedia = useMemo(() => {
    return allMedia.filter((m) => m.genre.toLowerCase().includes('drama'));
  }, [allMedia]);

  const comedyMedia = useMemo(() => {
    return allMedia.filter((m) => m.genre.toLowerCase().includes('comedy'));
  }, [allMedia]);

  // Continue watching resolved media
  const continueWatchingItems = useMemo(() => {
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
    <div className="pb-20 space-y-6">
      {/* Cinematic Hero Section */}
      <HeroBanner
        featuredItems={featuredItems}
        onPlay={onPlayMedia}
        onMoreInfo={onSelectMedia}
      />

      {/* Continue Watching Section (if active history) */}
      {continueWatchingItems.length > 0 && (
        <section className="px-4 sm:px-8 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                Continue Watching
              </h3>
            </div>
            <button
              onClick={() => onNavigate('continue-watching')}
              className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All ({continueWatchingItems.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {continueWatchingItems.slice(0, 4).map(({ hist, media }) => (
              <ContinueWatchingCard
                key={hist.id}
                historyItem={hist}
                media={media}
                onResume={onPlayMedia}
                onRemove={clearWatchHistory}
              />
            ))}
          </div>
        </section>
      )}

      {/* Content Rails */}
      <div className="space-y-4">
        <MovieRow
          title="Trending Now"
          subtitle="Top rated across CineWave this week"
          items={trendingNow}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />

        <MovieRow
          title="Popular Movies"
          items={popularMovies}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
          onViewAll={() => onNavigate('movies')}
        />

        <MovieRow
          title="Popular TV Shows"
          items={popularShows}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
          onViewAll={() => onNavigate('tv-shows')}
        />

        <MovieRow
          title="New Releases"
          subtitle="Recently added 4K HDR releases"
          items={newReleases}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />

        <MovieRow
          title="Sci-Fi & Deep Space"
          items={sciFiMedia}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />

        <MovieRow
          title="Action & Adrenaline"
          items={actionMedia}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />

        <MovieRow
          title="Gripping Thrillers"
          items={thrillerMedia}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />

        <MovieRow
          title="Critically Acclaimed Drama"
          items={dramaMedia}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />

        <MovieRow
          title="Comedy & Lighthearted"
          items={comedyMedia}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
        />
      </div>

      {/* Brand Value / Experience Footer Callout */}
      <section className="px-4 sm:px-8 pt-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/50 border border-slate-800 p-8 sm:p-12">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Cinematic Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Your next story starts here.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Experience CineWave with pristine 4K video playback, immersive spatial audio, curated originals, and synced watch progress across all your devices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
