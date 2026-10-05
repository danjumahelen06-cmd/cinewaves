import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  size = 'md',
  showIcon = true,
}) => {
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className={`inline-flex items-center gap-1 font-semibold tabular-nums text-amber-400 ${textSize}`}>
      {showIcon && <Star className={`${iconSize} fill-amber-400 text-amber-400`} />}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
};
