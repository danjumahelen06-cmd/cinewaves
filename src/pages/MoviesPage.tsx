import React, { useState, useMemo } from 'react';
import { FilterBar, FilterState } from '../components/FilterBar';
import { MovieGrid } from '../components/MovieGrid';
import { SearchBar } from '../components/SearchBar';
import { useStream } from '../context/StreamContext';
import { MediaItem, Movie } from '../types';
import { Play, Info } from 'lucide-react';
import { RatingBadge } from '../components/RatingBadge';

interface MoviesPageProps {
  onSelectMedia: (media: MediaItem) => void;
  onPlayMedia: (media: MediaItem) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({
  onSelectMedia,
  onPlayMedia,
}) => {
  const { movies } = useStream();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    genre: '',
    year: '',
    minRating: 0,
    sortBy: 'featured',
  });

  const featuredMovie = useMemo(() => {
    return movies.find((m) => m.featured) || movies[0];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = movies.map((m) => ({ ...m, type: 'movie' as const }));

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast_members.toLowerCase().includes(q)
      );
    }

    // Genre filter
    if (filters.genre) {
      result = result.filter((m) =>
        m.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // Year filter
    if (filters.year) {
      if (filters.year === 'older') {
        result = result.filter((m) => m.release_year <= 2023);
      } else {
        result = result.filter((m) => m.release_year === Number(filters.year));
      }
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((m) => m.rating >= filters.minRating);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year-desc':
          return b.release_year - a.release_year;
        case 'year-asc':
          return a.release_year - b.release_year;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return result;
  }, [movies, searchQuery, filters]);

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="pt-20 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Featured Banner (if not searching) */}
      {!searchQuery && featuredMovie && (
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[21/9] min-h-[300px] flex items-end p-6 sm:p-10 shadow-2xl">
          <img
            src={featuredMovie.backdrop_url || featuredMovie.poster_url}
            alt={featuredMovie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-2">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Spotlight Feature
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
              {featuredMovie.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {featuredMovie.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlayMedia({ ...featuredMovie, type: 'movie' })}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Movie</span>
              </button>
              <button
                onClick={() => onSelectMedia({ ...featuredMovie, type: 'movie' })}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Info className="w-4 h-4" />
                <span>Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Movies Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse cinematic releases, indie gems, and high-octane blockbusters ({filteredMovies.length} titles)
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Filter movies by title or cast..."
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterUpdate}
      />

      {/* Movie Grid */}
      <MovieGrid
        items={filteredMovies}
        onSelect={onSelectMedia}
        onPlay={onPlayMedia}
        pageSize={18}
        emptyTitle="No movies match your criteria"
        emptyDescription="Try clearing your filters or changing your search terms to discover more movies."
      />
    </div>
  );
};
