import React from 'react';

interface GenreBadgeProps {
  genre: string;
  className?: string;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({ genre, className = '' }) => {
  return (
    <span
      className={`text-xs font-medium tracking-wider text-cyan-400/90 uppercase ${className}`}
    >
      {genre}
    </span>
  );
};
