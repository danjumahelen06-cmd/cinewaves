import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Movie, TVShow, MediaItem, WatchlistItem, FavoriteItem, WatchHistoryItem, Episode } from '../types';
import { INITIAL_MOVIES, INITIAL_TV_SHOWS } from '../lib/sampleData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchTrendingMovies, fetchTrendingShows } from '../lib/tmdb';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface StreamContextType {
  movies: Movie[];
  tvShows: TVShow[];
  watchlist: WatchlistItem[];
  favorites: FavoriteItem[];
  watchHistory: WatchHistoryItem[];
  isLoading: boolean;
  addToWatchlist: (mediaId: string, type: 'movie' | 'tv') => Promise<void>;
  removeFromWatchlist: (mediaId: string, type: 'movie' | 'tv') => Promise<void>;
  isInWatchlist: (mediaId: string, type: 'movie' | 'tv') => boolean;
  addToFavorites: (mediaId: string, type: 'movie' | 'tv') => Promise<void>;
  removeFromFavorites: (mediaId: string, type: 'movie' | 'tv') => Promise<void>;
  isFavorite: (mediaId: string, type: 'movie' | 'tv') => boolean;
  recordWatchProgress: (
    mediaId: string,
    type: 'movie' | 'tv',
    episodeId?: string,
    progressSeconds?: number,
    durationSeconds?: number
  ) => Promise<void>;
  clearWatchHistory: (historyId?: string) => Promise<void>;
  getMediaById: (mediaId: string, type?: 'movie' | 'tv') => MediaItem | undefined;
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<Movie>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  addTvShow: (show: Omit<TVShow, 'id'>) => Promise<TVShow>;
  updateTvShow: (id: string, show: Partial<TVShow>) => Promise<void>;
  deleteTvShow: (id: string) => Promise<void>;
  addEpisode: (showId: string, seasonId: string, ep: Omit<Episode, 'id'>) => Promise<void>;
  deleteEpisode: (showId: string, seasonId: string, episodeId: string) => Promise<void>;
  toggleFeatured: (id: string, type: 'movie' | 'tv') => Promise<void>;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

const LS_MOVIES_KEY = 'cinewave_movies_v2';
const LS_TV_SHOWS_KEY = 'cinewave_tv_shows_v2';
const LS_WATCHLIST_KEY = 'cinewave_watchlist_v2';
const LS_FAVORITES_KEY = 'cinewave_favorites_v2';
const LS_HISTORY_KEY = 'cinewave_history_v2';

function cleanStreamUrl(url?: string, fallback = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4'): string {
  if (!url || url.includes('commondatastorage.googleapis.com') || url.includes('youtube.com') || url.includes('youtu.be')) {
    return fallback;
  }
  return url;
}

export const StreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem(LS_MOVIES_KEY);
    let list = INITIAL_MOVIES;
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {
        list = INITIAL_MOVIES;
      }
    }
    return list.map((m) => ({
      ...m,
      video_url: cleanStreamUrl(m.video_url),
      trailer_url: cleanStreamUrl(m.trailer_url),
    }));
  });

  const [tvShows, setTvShows] = useState<TVShow[]>(() => {
    const saved = localStorage.getItem(LS_TV_SHOWS_KEY);
    let list = INITIAL_TV_SHOWS;
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {
        list = INITIAL_TV_SHOWS;
      }
    }
    return list.map((s) => ({
      ...s,
      trailer_url: cleanStreamUrl(s.trailer_url),
      seasons: (s.seasons || []).map((season) => ({
        ...season,
        episodes: (season.episodes || []).map((ep) => ({
          ...ep,
          video_url: cleanStreamUrl(ep.video_url),
        })),
      })),
    }));
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem(LS_WATCHLIST_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Seed initial watchlist with a couple of items
    return [
      {
        id: 'wl-1',
        user_id: user?.id || 'usr_demo_101',
        movie_id: 'm1',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'wl-2',
        user_id: user?.id || 'usr_demo_101',
        show_id: 'tv1',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ];
  });

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem(LS_FAVORITES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'fav-1',
        user_id: user?.id || 'usr_demo_101',
        movie_id: 'm3',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
  });

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    const saved = localStorage.getItem(LS_HISTORY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    // Default continue watching seed items
    return [
      {
        id: 'hist-1',
        user_id: user?.id || 'usr_demo_101',
        movie_id: 'm1',
        progress_seconds: 2450,
        duration_seconds: 8880,
        last_watched_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'hist-2',
        user_id: user?.id || 'usr_demo_101',
        show_id: 'tv1',
        episode_id: 'ep1-s1-tv1',
        progress_seconds: 1400,
        duration_seconds: 3120,
        last_watched_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LS_MOVIES_KEY, JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem(LS_TV_SHOWS_KEY, JSON.stringify(tvShows));
  }, [tvShows]);

  useEffect(() => {
    localStorage.setItem(LS_WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(watchHistory));
  }, [watchHistory]);

  // Fetch real content from TMDB with trailers
  useEffect(() => {
    let isMounted = true;
    async function loadLiveTmdbFeed() {
      try {
        const [tmdbMovies, tmdbShows] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingShows(),
        ]);

        if (isMounted) {
          if (tmdbMovies && tmdbMovies.length > 0) {
            setMovies((prev) => {
              const tmdbIds = new Set(tmdbMovies.map((m) => m.id));
              const combined = [...tmdbMovies, ...prev.filter((m) => !tmdbIds.has(m.id))];
              localStorage.setItem(LS_MOVIES_KEY, JSON.stringify(combined));
              return combined;
            });
          }
          if (tmdbShows && tmdbShows.length > 0) {
            setTvShows((prev) => {
              const tmdbIds = new Set(tmdbShows.map((s) => s.id));
              const combined = [...tmdbShows, ...prev.filter((s) => !tmdbIds.has(s.id))];
              localStorage.setItem(LS_TV_SHOWS_KEY, JSON.stringify(combined));
              return combined;
            });
          }
        }
      } catch (err) {
        console.error('TMDB live load warning:', err);
      }
    }

    loadLiveTmdbFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Supabase data if connected
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user) return;

    let isMounted = true;

    async function loadSupabaseData() {
      setIsLoading(true);
      try {
        // Fetch movies
        const { data: dbMovies } = await supabase!.from('movies').select('*');
        if (dbMovies && dbMovies.length > 0 && isMounted) {
          setMovies(dbMovies as Movie[]);
        }

        // Fetch tv_shows
        const { data: dbShows } = await supabase!.from('tv_shows').select('*, seasons(*, episodes(*))');
        if (dbShows && dbShows.length > 0 && isMounted) {
          setTvShows(dbShows as unknown as TVShow[]);
        }

        // Fetch watchlist for this user
        const { data: dbWatchlist } = await supabase!.from('watchlist').select('*').eq('user_id', user!.id);
        if (dbWatchlist && isMounted) {
          setWatchlist(dbWatchlist as WatchlistItem[]);
        }

        // Fetch favorites
        const { data: dbFavorites } = await supabase!.from('favorites').select('*').eq('user_id', user!.id);
        if (dbFavorites && isMounted) {
          setFavorites(dbFavorites as FavoriteItem[]);
        }

        // Fetch history
        const { data: dbHistory } = await supabase!.from('watch_history').select('*').eq('user_id', user!.id);
        if (dbHistory && isMounted) {
          setWatchHistory(dbHistory as WatchHistoryItem[]);
        }
      } catch (err) {
        console.error('Supabase query error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSupabaseData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Helpers
  const getMediaById = useCallback(
    (mediaId: string, type?: 'movie' | 'tv'): MediaItem | undefined => {
      if (type === 'movie') {
        const found = movies.find((m) => m.id === mediaId);
        return found ? { ...found, type: 'movie' } : undefined;
      }
      if (type === 'tv') {
        const found = tvShows.find((s) => s.id === mediaId);
        return found ? { ...found, type: 'tv' } : undefined;
      }
      const m = movies.find((item) => item.id === mediaId);
      if (m) return { ...m, type: 'movie' };
      const s = tvShows.find((item) => item.id === mediaId);
      if (s) return { ...s, type: 'tv' };
      return undefined;
    },
    [movies, tvShows]
  );

  const isInWatchlist = useCallback(
    (mediaId: string, type: 'movie' | 'tv'): boolean => {
      return watchlist.some((item) =>
        type === 'movie' ? item.movie_id === mediaId : item.show_id === mediaId
      );
    },
    [watchlist]
  );

  const addToWatchlist = useCallback(
    async (mediaId: string, type: 'movie' | 'tv') => {
      const userId = user?.id || 'usr_demo_101';
      if (isInWatchlist(mediaId, type)) return;

      const newItem: WatchlistItem = {
        id: `wl-${Date.now()}`,
        user_id: userId,
        movie_id: type === 'movie' ? mediaId : undefined,
        show_id: type === 'tv' ? mediaId : undefined,
        created_at: new Date().toISOString(),
      };

      setWatchlist((prev) => [newItem, ...prev]);
      showToast('Added to My List', 'success');

      if (isSupabaseConfigured && supabase && user) {
        await supabase.from('watchlist').insert({
          user_id: user.id,
          movie_id: type === 'movie' ? mediaId : null,
          show_id: type === 'tv' ? mediaId : null,
        });
      }
    },
    [user, isInWatchlist, showToast]
  );

  const removeFromWatchlist = useCallback(
    async (mediaId: string, type: 'movie' | 'tv') => {
      setWatchlist((prev) =>
        prev.filter((item) =>
          type === 'movie' ? item.movie_id !== mediaId : item.show_id !== mediaId
        )
      );
      showToast('Removed from My List', 'info');

      if (isSupabaseConfigured && supabase && user) {
        if (type === 'movie') {
          await supabase.from('watchlist').delete().eq('user_id', user.id).eq('movie_id', mediaId);
        } else {
          await supabase.from('watchlist').delete().eq('user_id', user.id).eq('show_id', mediaId);
        }
      }
    },
    [user, showToast]
  );

  const isFavorite = useCallback(
    (mediaId: string, type: 'movie' | 'tv'): boolean => {
      return favorites.some((item) =>
        type === 'movie' ? item.movie_id === mediaId : item.show_id === mediaId
      );
    },
    [favorites]
  );

  const addToFavorites = useCallback(
    async (mediaId: string, type: 'movie' | 'tv') => {
      const userId = user?.id || 'usr_demo_101';
      if (isFavorite(mediaId, type)) return;

      const newItem: FavoriteItem = {
        id: `fav-${Date.now()}`,
        user_id: userId,
        movie_id: type === 'movie' ? mediaId : undefined,
        show_id: type === 'tv' ? mediaId : undefined,
        created_at: new Date().toISOString(),
      };

      setFavorites((prev) => [newItem, ...prev]);
      showToast('Added to Favorites', 'success');

      if (isSupabaseConfigured && supabase && user) {
        await supabase.from('favorites').insert({
          user_id: user.id,
          movie_id: type === 'movie' ? mediaId : null,
          show_id: type === 'tv' ? mediaId : null,
        });
      }
    },
    [user, isFavorite, showToast]
  );

  const removeFromFavorites = useCallback(
    async (mediaId: string, type: 'movie' | 'tv') => {
      setFavorites((prev) =>
        prev.filter((item) =>
          type === 'movie' ? item.movie_id !== mediaId : item.show_id !== mediaId
        )
      );
      showToast('Removed from Favorites', 'info');

      if (isSupabaseConfigured && supabase && user) {
        if (type === 'movie') {
          await supabase.from('favorites').delete().eq('user_id', user.id).eq('movie_id', mediaId);
        } else {
          await supabase.from('favorites').delete().eq('user_id', user.id).eq('show_id', mediaId);
        }
      }
    },
    [user, showToast]
  );

  const recordWatchProgress = useCallback(
    async (
      mediaId: string,
      type: 'movie' | 'tv',
      episodeId?: string,
      progressSeconds = 0,
      durationSeconds = 0
    ) => {
      const userId = user?.id || 'usr_demo_101';
      setWatchHistory((prev) => {
        const filtered = prev.filter((item) => {
          if (type === 'movie') return item.movie_id !== mediaId;
          return item.show_id !== mediaId || (episodeId && item.episode_id !== episodeId);
        });

        const newItem: WatchHistoryItem = {
          id: `hist-${Date.now()}`,
          user_id: userId,
          movie_id: type === 'movie' ? mediaId : undefined,
          show_id: type === 'tv' ? mediaId : undefined,
          episode_id: episodeId,
          progress_seconds: progressSeconds,
          duration_seconds: durationSeconds,
          last_watched_at: new Date().toISOString(),
        };

        return [newItem, ...filtered];
      });

      if (isSupabaseConfigured && supabase && user) {
        await supabase.from('watch_history').upsert({
          user_id: user.id,
          movie_id: type === 'movie' ? mediaId : null,
          show_id: type === 'tv' ? mediaId : null,
          episode_id: episodeId || null,
          progress_seconds: Math.floor(progressSeconds),
          duration_seconds: Math.floor(durationSeconds),
          last_watched_at: new Date().toISOString(),
        });
      }
    },
    [user]
  );

  const clearWatchHistory = useCallback(
    async (historyId?: string) => {
      if (historyId) {
        setWatchHistory((prev) => prev.filter((h) => h.id !== historyId));
        showToast('Removed from Continue Watching', 'info');
      } else {
        setWatchHistory([]);
        showToast('Watch history cleared', 'info');
      }

      if (isSupabaseConfigured && supabase && user) {
        if (historyId) {
          await supabase.from('watch_history').delete().eq('id', historyId);
        } else {
          await supabase.from('watch_history').delete().eq('user_id', user.id);
        }
      }
    },
    [user, showToast]
  );

  // Admin Catalog Methods
  const addMovie = useCallback(
    async (movieData: Omit<Movie, 'id'>): Promise<Movie> => {
      const newMovie: Movie = {
        ...movieData,
        id: `m_${Date.now()}`,
        type: 'movie',
      };

      setMovies((prev) => [newMovie, ...prev]);
      showToast(`Added movie: ${newMovie.title}`, 'success');

      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('movies').insert(newMovie).select().single();
        if (data) return data as Movie;
      }
      return newMovie;
    },
    [showToast]
  );

  const updateMovie = useCallback(
    async (id: string, updates: Partial<Movie>) => {
      setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
      showToast('Movie updated successfully', 'success');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('movies').update(updates).eq('id', id);
      }
    },
    [showToast]
  );

  const deleteMovie = useCallback(
    async (id: string) => {
      setMovies((prev) => prev.filter((m) => m.id !== id));
      showToast('Movie removed from catalog', 'info');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('movies').delete().eq('id', id);
      }
    },
    [showToast]
  );

  const addTvShow = useCallback(
    async (showData: Omit<TVShow, 'id'>): Promise<TVShow> => {
      const newShow: TVShow = {
        ...showData,
        id: `tv_${Date.now()}`,
        type: 'tv',
      };

      setTvShows((prev) => [newShow, ...prev]);
      showToast(`Added TV show: ${newShow.title}`, 'success');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('tv_shows').insert(newShow);
      }
      return newShow;
    },
    [showToast]
  );

  const updateTvShow = useCallback(
    async (id: string, updates: Partial<TVShow>) => {
      setTvShows((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
      showToast('TV show updated successfully', 'success');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('tv_shows').update(updates).eq('id', id);
      }
    },
    [showToast]
  );

  const deleteTvShow = useCallback(
    async (id: string) => {
      setTvShows((prev) => prev.filter((s) => s.id !== id));
      showToast('TV Show removed from catalog', 'info');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('tv_shows').delete().eq('id', id);
      }
    },
    [showToast]
  );

  const addEpisode = useCallback(
    async (showId: string, seasonId: string, epData: Omit<Episode, 'id'>) => {
      const newEp: Episode = {
        ...epData,
        id: `ep_${Date.now()}`,
        season_id: seasonId,
      };

      setTvShows((prev) =>
        prev.map((s) => {
          if (s.id !== showId) return s;
          return {
            ...s,
            seasons: s.seasons.map((season) => {
              if (season.id !== seasonId) return season;
              return {
                ...season,
                episodes: [...season.episodes, newEp],
              };
            }),
          };
        })
      );

      showToast(`Episode added: ${newEp.title}`, 'success');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('episodes').insert(newEp);
      }
    },
    [showToast]
  );

  const deleteEpisode = useCallback(
    async (showId: string, seasonId: string, episodeId: string) => {
      setTvShows((prev) =>
        prev.map((s) => {
          if (s.id !== showId) return s;
          return {
            ...s,
            seasons: s.seasons.map((season) => {
              if (season.id !== seasonId) return season;
              return {
                ...season,
                episodes: season.episodes.filter((e) => e.id !== episodeId),
              };
            }),
          };
        })
      );

      showToast('Episode removed', 'info');

      if (isSupabaseConfigured && supabase) {
        await supabase.from('episodes').delete().eq('id', episodeId);
      }
    },
    [showToast]
  );

  const toggleFeatured = useCallback(
    async (id: string, type: 'movie' | 'tv') => {
      if (type === 'movie') {
        setMovies((prev) =>
          prev.map((m) => (m.id === id ? { ...m, featured: !m.featured } : m))
        );
      } else {
        setTvShows((prev) =>
          prev.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s))
        );
      }
      showToast('Featured status updated', 'success');
    },
    [showToast]
  );

  return (
    <StreamContext.Provider
      value={{
        movies,
        tvShows,
        watchlist,
        favorites,
        watchHistory,
        isLoading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        recordWatchProgress,
        clearWatchHistory,
        getMediaById,
        addMovie,
        updateMovie,
        deleteMovie,
        addTvShow,
        updateTvShow,
        deleteTvShow,
        addEpisode,
        deleteEpisode,
        toggleFeatured,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
