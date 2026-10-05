import React, { useState } from 'react';
import { Settings, Database, Volume2, Monitor, Subtitles, ShieldCheck, Check, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured, SUPABASE_STATUS } from '../lib/supabase';
import { TMDB_API_KEY } from '../lib/tmdb';
import { useToast } from '../context/ToastContext';

interface SettingsPageProps {
  onOpenSupabaseModal: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenSupabaseModal }) => {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [streamQuality, setStreamQuality] = useState('4k');
  const [audioFormat, setAudioFormat] = useState('atmos');
  const [subtitleLang, setSubtitleLang] = useState('en');
  const [autoplayNext, setAutoplayNext] = useState(true);

  const handleSave = () => {
    showToast('Preferences updated successfully', 'success');
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-white">
          Playback & Account Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your streaming playback, audio quality, and database configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Playback Quality */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Streaming Video Quality</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: '4k', label: '4K Ultra HD', desc: 'Highest fidelity with HDR/Dolby Vision (~7 GB/hr)' },
              { id: '1080p', label: '1080p Full HD', desc: 'High definition with low latency (~2 GB/hr)' },
              { id: 'auto', label: 'Auto (Data Saver)', desc: 'Adjusts automatically to bandwidth' },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setStreamQuality(q.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  streamQuality === q.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm mb-1 text-white">
                  <span>{q.label}</span>
                  {streamQuality === q.id && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400">{q.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Quality */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Audio & Spatial Sound</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'atmos', label: 'Dolby Atmos & 5.1 Surround', desc: 'Immersive multi-channel soundstage' },
              { id: 'stereo', label: 'Standard Stereo 2.0', desc: 'Balanced for standard headphones and built-in speakers' },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => setAudioFormat(a.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  audioFormat === a.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm mb-1 text-white">
                  <span>{a.label}</span>
                  {audioFormat === a.id && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Subtitles & Captions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <Subtitles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Subtitles & Audio Language</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label className="text-xs text-slate-400 block mb-1">Default Subtitle Language</label>
              <select
                value={subtitleLang}
                onChange={(e) => setSubtitleLang(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="en">English (CC Original)</option>
                <option value="es">Español (Latinoamérica)</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-sm font-semibold text-white block">Autoplay Next Episode</span>
                <span className="text-xs text-slate-400">Continuous playback for series</span>
              </div>
              <input
                type="checkbox"
                checked={autoplayNext}
                onChange={(e) => setAutoplayNext(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* TMDB Video & Movie Database */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">TMDB Video & Trailer API</h3>
                <p className="text-xs text-slate-400">
                  Live movie data, official 1080p YouTube video trailers, backdrop artwork, and ratings
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Connected
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400">Active API Key: </span>
              <span className="font-mono text-cyan-300">
                {TMDB_API_KEY ? `${TMDB_API_KEY.slice(0, 6)}••••••••••••••••${TMDB_API_KEY.slice(-4)}` : 'Not Configured'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Live Trending & YouTube Video Streams</span>
          </div>
        </div>

        {/* Supabase Database Connection */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">Supabase Cloud Database</h3>
                <p className="text-xs text-slate-400">
                  PostgreSQL database hosting profiles, catalog, watch history, and RLS security
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSupabaseModal}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              View SQL Schema & Setup
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400">Connection status: </span>
              {isSupabaseConfigured ? (
                <span className="text-emerald-400 font-bold">Active Cloud Connection ({SUPABASE_STATUS.url})</span>
              ) : (
                <span className="text-cyan-400 font-semibold">Local Interactive Persistence (Instant Sandbox Ready)</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
