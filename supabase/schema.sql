-- CineWave: Complete Supabase Database Schema & Row Level Security (RLS)
-- Copy and run this script in the Supabase SQL Editor (https://app.supabase.com)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url, is_admin)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. MOVIES TABLE
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    video_url TEXT,
    release_year INTEGER,
    runtime INTEGER, -- in minutes
    rating NUMERIC(3,1),
    genre TEXT,
    type TEXT DEFAULT 'movie',
    director TEXT,
    cast_members TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TV SHOWS TABLE
CREATE TABLE IF NOT EXISTS public.tv_shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    release_year INTEGER,
    rating NUMERIC(3,1),
    genre TEXT,
    cast_members TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SEASONS TABLE
CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id UUID NOT NULL REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EPISODES TABLE
CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    duration INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. WATCHLIST TABLE
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    show_id UUID REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_watchlist_target CHECK (
        (movie_id IS NOT NULL AND show_id IS NULL) OR
        (movie_id IS NULL AND show_id IS NOT NULL)
    )
);

-- 8. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    show_id UUID REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_favorites_target CHECK (
        (movie_id IS NOT NULL AND show_id IS NULL) OR
        (movie_id IS NULL AND show_id IS NOT NULL)
    )
);

-- 9. WATCH HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    show_id UUID REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
    progress_seconds INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_movies_featured ON public.movies(featured);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON public.movies(genre);
CREATE INDEX IF NOT EXISTS idx_tv_shows_featured ON public.tv_shows(featured);
CREATE INDEX IF NOT EXISTS idx_seasons_show_id ON public.seasons(show_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON public.episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON public.watch_history(user_id);

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view (for avatars/names), users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Catalog: Everyone can view movies, tv_shows, seasons, episodes
CREATE POLICY "Public can view movies" ON public.movies
    FOR SELECT USING (true);

CREATE POLICY "Public can view tv_shows" ON public.tv_shows
    FOR SELECT USING (true);

CREATE POLICY "Public can view seasons" ON public.seasons
    FOR SELECT USING (true);

CREATE POLICY "Public can view episodes" ON public.episodes
    FOR SELECT USING (true);

-- Admin policies for catalog modification (checks profiles.is_admin)
CREATE POLICY "Admins can manage movies" ON public.movies
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

CREATE POLICY "Admins can manage tv_shows" ON public.tv_shows
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

CREATE POLICY "Admins can manage seasons" ON public.seasons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

CREATE POLICY "Admins can manage episodes" ON public.episodes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- User-specific tables: Watchlist
CREATE POLICY "Users can view their own watchlist" ON public.watchlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watchlist" ON public.watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their watchlist" ON public.watchlist
    FOR DELETE USING (auth.uid() = user_id);

-- User-specific tables: Favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- User-specific tables: Watch History
CREATE POLICY "Users can view their own watch history" ON public.watch_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert watch history" ON public.watch_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their watch history" ON public.watch_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their watch history" ON public.watch_history
    FOR DELETE USING (auth.uid() = user_id);
