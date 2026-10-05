/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreamProvider, useStream } from './context/StreamContext';
import { Navbar } from './components/Navbar';
import { MobileNavigation } from './components/MobileNavigation';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { ActivePage, MediaItem } from './types';

// Pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TvShowsPage } from './pages/TvShowsPage';
import { DetailsPage } from './pages/DetailsPage';
import { SearchPage } from './pages/SearchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ContinueWatchingPage } from './pages/ContinueWatchingPage';
import { PlayerPage } from './pages/PlayerPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { movies, tvShows } = useStream();

  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [playerConfig, setPlayerConfig] = useState<{
    media: MediaItem;
    episodeId?: string;
    startSeconds?: number;
  } | null>(null);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Navigate helper with scroll-to-top
  const navigate = (page: ActivePage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    navigate('details');
  };

  const handlePlayMedia = (
    media: MediaItem,
    episodeId?: string,
    startSeconds = 0
  ) => {
    setPlayerConfig({ media, episodeId, startSeconds });
    navigate('player');
  };

  // If user accesses details directly without a selection, default to first movie
  const currentDetailsMedia: MediaItem =
    selectedMedia ||
    (movies.length > 0
      ? { ...movies[0], type: 'movie' as const }
      : { ...tvShows[0], type: 'tv' as const });

  // If user accesses player directly without selection, default to first movie
  const currentPlayerMedia: MediaItem =
    playerConfig?.media ||
    selectedMedia ||
    (movies.length > 0
      ? { ...movies[0], type: 'movie' as const }
      : { ...tvShows[0], type: 'tv' as const });

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0] flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      {currentPage !== 'player' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigate}
          onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        />
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'movies' && (
          <MoviesPage
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
          />
        )}

        {currentPage === 'tv-shows' && (
          <TvShowsPage
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
          />
        )}

        {currentPage === 'details' && (
          <DetailsPage
            media={currentDetailsMedia}
            onPlay={handlePlayMedia}
            onSelectMedia={handleSelectMedia}
            onBack={() => navigate('home')}
          />
        )}

        {currentPage === 'search' && (
          <SearchPage
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
          />
        )}

        {currentPage === 'watchlist' && (
          <WatchlistPage
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'favorites' && (
          <FavoritesPage
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'continue-watching' && (
          <ContinueWatchingPage
            onPlayMedia={handlePlayMedia}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'player' && (
          <PlayerPage
            media={currentPlayerMedia}
            episodeId={playerConfig?.episodeId}
            startSeconds={playerConfig?.startSeconds}
            onBack={() => (selectedMedia ? navigate('details') : navigate('home'))}
            onSelectMedia={handleSelectMedia}
            onPlayMedia={handlePlayMedia}
          />
        )}

        {currentPage === 'login' && <LoginPage onNavigate={navigate} />}

        {currentPage === 'signup' && <SignUpPage onNavigate={navigate} />}

        {currentPage === 'profile' && <ProfilePage onNavigate={navigate} />}

        {currentPage === 'settings' && (
          <SettingsPage onOpenSupabaseModal={() => setSupabaseModalOpen(true)} />
        )}

        {currentPage === 'admin' && <AdminDashboardPage onNavigate={navigate} />}
      </main>

      {/* Mobile Bottom Navigation */}
      {currentPage !== 'player' && (
        <MobileNavigation currentPage={currentPage} onNavigate={navigate} />
      )}

      {/* Supabase Setup & SQL Schema Modal */}
      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StreamProvider>
          <AppContent />
        </StreamProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
