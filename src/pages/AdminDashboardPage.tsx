import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Film,
  Tv,
  Users,
  Bookmark,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Star,
  Check,
  Search,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import { Movie, TVShow, ActivePage } from '../types';
import { Modal } from '../components/Modal';

interface AdminDashboardPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { isAdmin, toggleAdminRole } = useAuth();
  const {
    movies,
    tvShows,
    watchlist,
    watchHistory,
    addMovie,
    updateMovie,
    deleteMovie,
    addTvShow,
    deleteTvShow,
    toggleFeatured,
  } = useStream();

  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'tv-shows'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Movie Modal state
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    release_year: 2026,
    runtime: 120,
    rating: 8.5,
    genre: 'Sci-Fi',
    director: '',
    cast_members: '',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  });

  // TV Show Modal state
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [showForm, setShowForm] = useState({
    title: '',
    description: '',
    release_year: 2025,
    rating: 8.8,
    genre: 'Drama',
    cast_members: '',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  });

  // Calculate statistics
  const totalMovies = movies.length;
  const totalShows = tvShows.length;
  const totalEpisodes = tvShows.reduce(
    (sum, s) => sum + s.seasons.reduce((sSum, season) => sSum + season.episodes.length, 0),
    0
  );
  const totalWatchlist = watchlist.length;
  const totalWatches = watchHistory.length;

  // Filtered lists
  const filteredMovies = useMemo(() => {
    if (!searchTerm.trim()) return movies;
    const q = searchTerm.toLowerCase();
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
    );
  }, [movies, searchTerm]);

  const filteredShows = useMemo(() => {
    if (!searchTerm.trim()) return tvShows;
    const q = searchTerm.toLowerCase();
    return tvShows.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q) ||
        s.cast_members.toLowerCase().includes(q)
    );
  }, [tvShows, searchTerm]);

  // Open Movie Edit
  const handleEditMovie = (m: Movie) => {
    setEditingMovieId(m.id);
    setMovieForm({
      title: m.title,
      description: m.description,
      release_year: m.release_year,
      runtime: m.runtime,
      rating: m.rating,
      genre: m.genre,
      director: m.director,
      cast_members: m.cast_members,
      video_url: m.video_url,
      poster_url: m.poster_url,
      backdrop_url: m.backdrop_url,
      featured: Boolean(m.featured),
    });
    setMovieModalOpen(true);
  };

  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm({
      title: '',
      description: '',
      release_year: 2026,
      runtime: 125,
      rating: 8.6,
      genre: 'Sci-Fi',
      director: 'Evelyn Vance',
      cast_members: 'Marcus Reed, Sarah Lin',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMovieId) {
      await updateMovie(editingMovieId, movieForm);
    } else {
      await addMovie({
        ...movieForm,
        type: 'movie',
      });
    }
    setMovieModalOpen(false);
  };

  const handleSaveShow = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTvShow({
      ...showForm,
      type: 'tv',
      seasons: [
        {
          id: `s1_${Date.now()}`,
          show_id: `tv_${Date.now()}`,
          season_number: 1,
          title: 'Season 1',
          episodes: [
            {
              id: `ep1_${Date.now()}`,
              season_id: `s1_${Date.now()}`,
              episode_number: 1,
              title: 'Pilot',
              description: 'The series premiere episode.',
              thumbnail_url: showForm.backdrop_url,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
              duration: 52,
            },
          ],
        },
      ],
    });
    setShowModalOpen(false);
  };

  if (!isAdmin) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Administrator Access Required</h2>
        <p className="text-sm text-slate-400">
          You are currently in standard viewer mode. Switch to Administrator role to manage the CineWave catalog and streaming database.
        </p>
        <button
          onClick={toggleAdminRole}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          Enable Admin Role
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              CINEWAVE CONTROL
            </span>
            <span className="text-xs text-slate-400">Database & Content Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Studio Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddMovie}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Movie</span>
          </button>
          <button
            onClick={() => setShowModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add TV Show</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Movies</span>
            <Film className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">
            {totalMovies}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>TV Series</span>
            <Tv className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">
            {totalShows}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Episodes</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">
            {totalEpisodes}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Watchlist Saves</span>
            <Bookmark className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">
            {totalWatchlist}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Playback Sessions</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">
            {totalWatches}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {(['overview', 'movies', 'tv-shows'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'overview' ? 'Catalog Overview' : tab === 'movies' ? 'Manage Movies' : 'Manage Series'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Movies Table */}
      {(activeTab === 'overview' || activeTab === 'movies') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white">
              Movies Catalog ({filteredMovies.length})
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Genre</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredMovies.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-medium text-white flex items-center gap-2">
                      <div className="w-8 h-10 rounded overflow-hidden bg-slate-900 shrink-0">
                        <img src={m.poster_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate max-w-[200px]">{m.title}</span>
                    </td>
                    <td className="p-3.5 tabular-nums text-slate-400">{m.release_year}</td>
                    <td className="p-3.5 text-cyan-400">{m.genre}</td>
                    <td className="p-3.5 font-bold text-amber-400 tabular-nums">{m.rating}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleFeatured(m.id, 'movie')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          m.featured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-500 hover:text-white'
                        }`}
                      >
                        {m.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleEditMovie(m)}
                        className="p-1.5 hover:text-cyan-400 text-slate-400 transition-colors"
                        title="Edit movie"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMovie(m.id)}
                        className="p-1.5 hover:text-rose-400 text-slate-400 transition-colors"
                        title="Delete movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TV Shows Table */}
      {(activeTab === 'overview' || activeTab === 'tv-shows') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white">
              TV Shows Catalog ({filteredShows.length})
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Seasons</th>
                  <th className="p-3.5">Genre</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredShows.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-medium text-white flex items-center gap-2">
                      <div className="w-8 h-10 rounded overflow-hidden bg-slate-900 shrink-0">
                        <img src={s.poster_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate max-w-[200px]">{s.title}</span>
                    </td>
                    <td className="p-3.5 tabular-nums text-slate-400">
                      {s.seasons?.length || 1} Seasons
                    </td>
                    <td className="p-3.5 text-cyan-400">{s.genre}</td>
                    <td className="p-3.5 font-bold text-amber-400 tabular-nums">{s.rating}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleFeatured(s.id, 'tv')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          s.featured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-500 hover:text-white'
                        }`}
                      >
                        {s.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => deleteTvShow(s.id)}
                        className="p-1.5 hover:text-rose-400 text-slate-400 transition-colors"
                        title="Delete TV show"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={movieModalOpen}
        onClose={() => setMovieModalOpen(false)}
        title={editingMovieId ? 'Edit Movie Metadata' : 'Add New Movie to CineWave'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Movie Title</label>
              <input
                type="text"
                required
                value={movieForm.title}
                onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Genre (e.g. Sci-Fi, Action)</label>
              <input
                type="text"
                required
                value={movieForm.genre}
                onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Synopsis / Description</label>
            <textarea
              rows={3}
              required
              value={movieForm.description}
              onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Release Year</label>
              <input
                type="number"
                value={movieForm.release_year}
                onChange={(e) => setMovieForm({ ...movieForm, release_year: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Runtime (Minutes)</label>
              <input
                type="number"
                value={movieForm.runtime}
                onChange={(e) => setMovieForm({ ...movieForm, runtime: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                value={movieForm.rating}
                onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Director</label>
              <input
                type="text"
                value={movieForm.director}
                onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Cast Members</label>
              <input
                type="text"
                value={movieForm.cast_members}
                onChange={(e) => setMovieForm({ ...movieForm, cast_members: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Video Stream URL (.mp4)</label>
            <input
              type="url"
              required
              value={movieForm.video_url}
              onChange={(e) => setMovieForm({ ...movieForm, video_url: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featMovieCheck"
              checked={movieForm.featured}
              onChange={(e) => setMovieForm({ ...movieForm, featured: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
            <label htmlFor="featMovieCheck" className="text-slate-300 font-medium cursor-pointer">
              Mark as Featured in Hero Banner
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setMovieModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
            >
              {editingMovieId ? 'Save Changes' : 'Create Movie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add TV Show Modal */}
      <Modal
        isOpen={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        title="Add New TV Series"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveShow} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Series Title</label>
              <input
                type="text"
                required
                value={showForm.title}
                onChange={(e) => setShowForm({ ...showForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Genre</label>
              <input
                type="text"
                required
                value={showForm.genre}
                onChange={(e) => setShowForm({ ...showForm, genre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Description</label>
            <textarea
              rows={3}
              required
              value={showForm.description}
              onChange={(e) => setShowForm({ ...showForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Release Year</label>
              <input
                type="number"
                value={showForm.release_year}
                onChange={(e) => setShowForm({ ...showForm, release_year: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                value={showForm.rating}
                onChange={(e) => setShowForm({ ...showForm, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Cast Members</label>
            <input
              type="text"
              value={showForm.cast_members}
              onChange={(e) => setShowForm({ ...showForm, cast_members: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
            >
              Create Series
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
