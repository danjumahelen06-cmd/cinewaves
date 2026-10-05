import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  genre: string;
  year: string;
  minRating: number;
  sortBy: 'featured' | 'rating' | 'year-desc' | 'year-asc' | 'title-asc';
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  genres?: string[];
  showGenreTabs?: boolean;
}

const DEFAULT_GENRES = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Documentary',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  genres = DEFAULT_GENRES,
  showGenreTabs = true,
}) => {
  return (
    <div className="space-y-4 py-2">
      {/* Horizontal Scrollable Genre Tabs (Clean Segmented Controls per frontend-design rule 0.A) */}
      {showGenreTabs && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {genres.map((g) => {
            const isActive =
              (g === 'All' && !filters.genre) || filters.genre === g;
            return (
              <button
                key={g}
                onClick={() => onFilterChange({ genre: g === 'All' ? '' : g })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      )}

      {/* Secondary Controls: Year, Rating, Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filters:</span>
          </div>

          {/* Release Year Dropdown */}
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400 transition-colors"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="older">2023 & Earlier</option>
          </select>

          {/* Min Rating Dropdown */}
          <select
            value={filters.minRating}
            onChange={(e) => onFilterChange({ minRating: Number(e.target.value) })}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400 transition-colors"
          >
            <option value={0}>Any Rating</option>
            <option value={8.5}>8.5+ Rating</option>
            <option value={8.0}>8.0+ Rating</option>
            <option value={7.5}>7.5+ Rating</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
          >
            <option value="featured">Featured First</option>
            <option value="rating">Highest Rated</option>
            <option value="year-desc">Newest Releases</option>
            <option value="year-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
