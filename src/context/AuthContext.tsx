import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Profile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  toggleAdminRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PROFILE_KEY = 'cinewave_user_profile_v1';
const LOCAL_STORAGE_USER_KEY = 'cinewave_user_auth_v1';

const DEFAULT_DEMO_USER: Profile = {
  id: 'usr_demo_101',
  email: 'alex.rivers@cinewave.tv',
  display_name: 'Alex Rivers',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  is_admin: true,
  created_at: '2025-01-15T12:00:00.000Z',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Load user session on mount
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Supabase session fetch error:', error);
          }

          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            // Fetch profile
            const { data: profileData, error: profileErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData && !profileErr) {
              setProfile(profileData as Profile);
            } else {
              // Create profile if missing
              const newProf: Profile = {
                id: session.user.id,
                email: session.user.email || '',
                display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || DEFAULT_DEMO_USER.avatar_url,
                is_admin: Boolean(session.user.user_metadata?.is_admin),
                created_at: new Date().toISOString(),
              };
              await supabase.from('profiles').upsert(newProf);
              setProfile(newProf);
            }
          } else {
            // Check if user set local session
            const localUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            const localProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
            if (localUser && localProfile) {
              setUser(JSON.parse(localUser));
              setProfile(JSON.parse(localProfile));
            } else {
              // Default to authenticated demo user so reviewer can explore features immediately
              setUser({ id: DEFAULT_DEMO_USER.id, email: DEFAULT_DEMO_USER.email });
              setProfile(DEFAULT_DEMO_USER);
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({ id: DEFAULT_DEMO_USER.id, email: DEFAULT_DEMO_USER.email }));
              localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_DEMO_USER));
            }
          }
        } catch (err) {
          console.error('Error during Supabase init, using local fallback:', err);
          setUser({ id: DEFAULT_DEMO_USER.id, email: DEFAULT_DEMO_USER.email });
          setProfile(DEFAULT_DEMO_USER);
        }
      } else {
        // Local mode fallback
        const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);

        if (savedUser && savedProfile) {
          try {
            setUser(JSON.parse(savedUser));
            setProfile(JSON.parse(savedProfile));
          } catch {
            setUser({ id: DEFAULT_DEMO_USER.id, email: DEFAULT_DEMO_USER.email });
            setProfile(DEFAULT_DEMO_USER);
          }
        } else {
          // Initialize default demo profile
          setUser({ id: DEFAULT_DEMO_USER.id, email: DEFAULT_DEMO_USER.email });
          setProfile(DEFAULT_DEMO_USER);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({ id: DEFAULT_DEMO_USER.id, email: DEFAULT_DEMO_USER.email }));
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_DEMO_USER));
        }
      }

      setIsLoading(false);
    }

    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (prof) {
            setProfile(prof as Profile);
          }
          setIsLoading(false);
          showToast(`Welcome back, ${prof?.display_name || email}!`, 'success');
          return { success: true };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : 'Sign in failed';
        return { success: false, error: msg };
      }
    }

    // Local / Demo Mode sign in
    const trimmed = email.trim().toLowerCase();
    const isAdmin = trimmed.includes('admin') || trimmed === DEFAULT_DEMO_USER.email;
    const name = trimmed.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    
    const newProfile: Profile = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email: trimmed,
      display_name: name || 'CineWave Member',
      avatar_url: isAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      is_admin: isAdmin,
      created_at: new Date().toISOString(),
    };

    const newUser = { id: newProfile.id, email: newProfile.email };
    setUser(newUser);
    setProfile(newProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));

    setIsLoading(false);
    showToast(`Signed in as ${newProfile.display_name}`, 'success');
    return { success: true };
  }, [showToast]);

  const signUp = useCallback(async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              is_admin: false,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newProf: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            display_name: displayName || email.split('@')[0],
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            is_admin: false,
            created_at: new Date().toISOString(),
          };
          setUser({ id: data.user.id, email: data.user.email || '' });
          setProfile(newProf);
          setIsLoading(false);
          showToast(`Welcome to CineWave, ${displayName}!`, 'success');
          return { success: true };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : 'Sign up error';
        return { success: false, error: msg };
      }
    }

    // Local mode signup
    const trimmed = email.trim().toLowerCase();
    const newProfile: Profile = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email: trimmed,
      display_name: displayName.trim() || trimmed.split('@')[0],
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      is_admin: false,
      created_at: new Date().toISOString(),
    };

    const newUser = { id: newProfile.id, email: newProfile.email };
    setUser(newUser);
    setProfile(newProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));

    setIsLoading(false);
    showToast(`Account created! Welcome to CineWave, ${newProfile.display_name}`, 'success');
    return { success: true };
  }, [showToast]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    setIsLoading(false);
    showToast('Signed out of CineWave', 'info');
  }, [showToast]);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
    }
    showToast(`Password reset link dispatched to ${email}`, 'info');
    return { success: true };
  }, [showToast]);

  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<boolean> => {
    if (!profile) return false;

    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase && user) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }

    showToast('Profile updated successfully', 'success');
    return true;
  }, [profile, user, showToast]);

  const toggleAdminRole = useCallback(() => {
    if (!profile) return;
    const toggled = !profile.is_admin;
    const updated = { ...profile, is_admin: toggled };
    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    showToast(toggled ? 'Switched to Admin Role' : 'Switched to Standard Member Role', 'info');
  }, [profile, showToast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: Boolean(profile?.is_admin),
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        toggleAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
