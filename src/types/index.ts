export type MediaType = 'movie' | 'tv';

export interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  trailer_url?: string;
  video_url: string;
  release_year: number;
  runtime: number; // in minutes
  rating: number; // 0.0 - 10.0
  genre: string; // e.g. "Sci-Fi, Action"
  type: 'movie';
  director: string;
  cast_members: string;
  featured?: boolean;
  created_at?: string;
}

export interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: number; // in minutes
  created_at?: string;
}

export interface Season {
  id: string;
  show_id: string;
  season_number: number;
  title: string;
  episodes: Episode[];
  created_at?: string;
}

export interface TVShow {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  trailer_url?: string;
  release_year: number;
  rating: number;
  genre: string;
  cast_members: string;
  featured?: boolean;
  seasons: Season[];
  type?: 'tv';
  created_at?: string;
}

export type MediaItem = (Movie & { type: 'movie' }) | (TVShow & { type: 'tv' });

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  is_admin: boolean;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id?: string;
  show_id?: string;
  created_at: string;
  media?: MediaItem;
}

export interface FavoriteItem {
  id: string;
  user_id: string;
  movie_id?: string;
  show_id?: string;
  created_at: string;
  media?: MediaItem;
}

export interface WatchHistoryItem {
  id: string;
  user_id: string;
  movie_id?: string;
  show_id?: string;
  episode_id?: string;
  progress_seconds: number;
  duration_seconds: number;
  last_watched_at: string;
  media?: MediaItem;
  episode?: Episode;
}

export type ActivePage =
  | 'home'
  | 'movies'
  | 'tv-shows'
  | 'details'
  | 'search'
  | 'watchlist'
  | 'favorites'
  | 'continue-watching'
  | 'player'
  | 'login'
  | 'signup'
  | 'profile'
  | 'settings'
  | 'admin';

export interface PlayerParams {
  type: 'movie' | 'tv';
  mediaId: string;
  episodeId?: string;
  startSeconds?: number;
}
