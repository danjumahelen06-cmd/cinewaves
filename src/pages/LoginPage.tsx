import React, { useState } from 'react';
import { Film, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ActivePage } from '../types';

interface LoginPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onNavigate('home');
    } else {
      setErrorMessage(result.error || 'Unable to sign in. Please check your email and password.');
    }
  };

  const handleDemoSignIn = async (asAdmin = false) => {
    setIsSubmitting(true);
    setErrorMessage('');
    const demoEmail = asAdmin ? 'admin@cinewave.tv' : 'alex.rivers@cinewave.tv';
    const result = await signIn(demoEmail, 'password123');
    setIsSubmitting(false);
    if (result.success) {
      onNavigate('home');
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      setErrorMessage('Enter your email address first to receive a password reset link.');
      return;
    }
    await resetPassword(email);
    setResetSent(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 mb-2">
            <Film className="w-6 h-6 fill-slate-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Welcome back to CineWave
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access your watchlist, continue watching, and 4K playback
          </p>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Reset Confirmation */}
        {resetSent && (
          <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 text-xs font-medium">
            Password reset dispatched. Check your inbox for instructions.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Shortcuts */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <p className="text-[11px] text-center text-slate-400 uppercase tracking-wider font-semibold">
            Instant Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSignIn(false)}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standard User</span>
            </button>
            <button
              onClick={() => handleDemoSignIn(true)}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin User</span>
            </button>
          </div>
        </div>

        {/* Switch to SignUp */}
        <p className="text-xs text-center text-slate-400">
          New to CineWave?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-cyan-400 hover:underline font-semibold cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};
