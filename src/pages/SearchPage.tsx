import React, { useState, useMemo } from 'react';
import { Search, Film, Tv, Users, Clapperboard, Sparkles } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { EmptyState } from '../components/EmptyState';
import { useStream } from '../context/StreamContext';
import { MediaItem } from '../types';

interface SearchPageProps {
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem) => void;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'Sci-Fi',
  'Cyberpunk',
  'Action',
  'Idris Elba',
  'Deep Space',
  'Thriller',
  'Pedro Pascal',
  'Documentary',
  'Adventure',
];

export const SearchPage: React.FC<SearchPageProps> = ({
  onSelectMedia,
  onPlayMedia,
}) => {
  const { movies, tvShows } = useStream();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'movie' | 'tv'>('all');

  const allMedia: MediaItem[] = useMemo(() => {
    return [
      ...movies.map((m) => ({ ...m, type: 'movie' as const })),
      ...tvShows.map((s) => ({ ...s, type: 'tv' as const })),
    ];
  }, [movies, tvShows]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let filtered = allMedia.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchGenre = item.genre.toLowerCase().includes(q);
      const matchDescription = item.description.toLowerCase().includes(q);
      const matchCast = item.cast_members?.toLowerCase().includes(q);
      const matchDirector = 'director' in item && item.director?.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchDescription || matchCast || matchDirector;
    });

    if (activeCategory === 'movie') {
      filtered = filtered.filter((item) => item.type === 'movie');
    } else if (activeCategory === 'tv') {
      filtered = filtered.filter((item) => item.type === 'tv');
    }

    return filtered;
  }, [allMedia, query, activeCategory]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Search Header */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
          Explore CineWave
        </h1>
        <p className="text-sm text-slate-400">
          Search through thousands of hours of movies, series, directors, and actors
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          autoFocus={true}
          placeholder="Search movies, TV shows, actors, or genres..."
        />

        {/* Suggestion Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Popular searches:</span>
          </span>
          {POPULAR_SEARCH_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="text-xs text-slate-400 hover:text-cyan-300 hover:underline px-1 py-0.5 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs if query is active */}
      {query.trim() && (
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-sm text-slate-400">
            Results for <span className="text-white font-semibold">"{query}"</span>:
            <span className="text-cyan-400 font-bold ml-1.5">{searchResults.length} matches</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setActiveCategory('movie')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeCategory === 'movie'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Movies Only
            </button>
            <button
              onClick={() => setActiveCategory('tv')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeCategory === 'tv'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TV Series Only
            </button>
          </div>
        </div>
      )}

      {/* Search Content */}
      {query.trim() ? (
        <MovieGrid
          items={searchResults}
          onSelect={onSelectMedia}
          onPlay={onPlayMedia}
          emptyTitle="No results found"
          emptyDescription="No results found. Try another title, genre, or actor."
        />
      ) : (
        /* Empty / Discovery State */
        <div className="pt-6 space-y-6">
          <div className="text-center text-slate-400 text-xs uppercase tracking-widest font-semibold">
            Trending Discoveries
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allMedia.slice(0, 12).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMedia(item)}
                className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={item.poster_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white truncate">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
