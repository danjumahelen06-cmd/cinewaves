import React, { useState } from 'react';
import { Modal } from './Modal';
import { Database, Check, Copy, ExternalLink, ShieldCheck, Key } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_STATUS } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA_SNIPPET = `-- CineWave: Supabase PostgreSQL Schema with RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Movies table
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    video_url TEXT,
    release_year INTEGER,
    runtime INTEGER,
    rating NUMERIC(3,1),
    genre TEXT,
    type TEXT DEFAULT 'movie',
    director TEXT,
    cast_members TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TV Shows table
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

-- Watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    show_id UUID REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    show_id UUID REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Watch History table (Continue Watching)
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    show_id UUID REFERENCES public.tv_shows(id) ON DELETE CASCADE,
    episode_id UUID,
    progress_seconds INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Public can view tv_shows" ON public.tv_shows FOR SELECT USING (true);
CREATE POLICY "Users can manage own watchlist" ON public.watchlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id);
`;

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET);
    setCopied(true);
    showToast('SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supabase Database & Integration" maxWidth="max-w-3xl">
      <div className="space-y-6 text-sm">
        {/* Connection Status Card */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          isSupabaseConfigured
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            : 'bg-cyan-950/20 border-cyan-500/30 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Status:</span>
                {isSupabaseConfigured ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Connected to Cloud Supabase
                  </span>
                ) : (
                  <span className="text-cyan-400 font-semibold">
                    Simulated Sandbox Mode (Instant Local Persistence)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupabaseConfigured
                  ? `Connected to: ${SUPABASE_STATUS.url}`
                  : 'CineWave is currently running with full local state. Connect your real Supabase instance below anytime!'}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step Setup instructions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base text-white">How to connect your Supabase project:</h4>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs sm:text-sm pl-1 leading-relaxed">
            <li>
              Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a new project.
            </li>
            <li>
              Navigate to the <strong>SQL Editor</strong> in your Supabase dashboard and run the SQL schema script provided below.
            </li>
            <li>
              Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong> from <em>Project Settings → API</em>.
            </li>
            <li>
              Add the keys into your environment configuration (or <code>.env</code> file):
            </li>
          </ol>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
            <div>
              <p>VITE_SUPABASE_URL="https://your-project.supabase.co"</p>
              <p>VITE_SUPABASE_ANON_KEY="your-anon-public-key"</p>
            </div>
            <Key className="w-4 h-4 text-slate-500 shrink-0" />
          </div>
        </div>

        {/* SQL Schema Copy Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span>SQL Schema Script</span>
              <span className="text-xs text-slate-500 font-normal">(PostgreSQL / Supabase DDL + RLS)</span>
            </h4>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="bg-[#05070a] p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-56 overflow-y-auto custom-scrollbar whitespace-pre leading-relaxed">
            {SQL_SCHEMA_SNIPPET}
          </pre>
          <p className="text-xs text-slate-500">
            * A full complete copy is also saved in <code>/supabase/schema.sql</code>.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
