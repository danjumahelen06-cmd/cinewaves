import React from 'react';
import { Season } from '../types';

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeasonId: string;
  onSelectSeason: (seasonId: string) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons,
  selectedSeasonId,
  onSelectSeason,
}) => {
  if (!seasons || seasons.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {seasons.map((season) => {
        const isSelected = season.id === selectedSeasonId;
        return (
          <button
            key={season.id}
            onClick={() => onSelectSeason(season.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {season.title || `Season ${season.season_number}`}
          </button>
        );
      })}
    </div>
  );
};
