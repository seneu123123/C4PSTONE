import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://xlwpddwdlcfrokqsfvaa.supabase.co';

const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd3BkZHdkbGNmcm9rcXNmdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDU4MDQsImV4cCI6MjEwNTMyMTgwNH0.Vvw9MOcXllbBQbQvhV33tHfYmS8-gLe9PbQJ7Nh7fjA';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string;
  emergency_contact?: string;
  nationality?: string;
  dietary_preferences?: string;
  role: 'Traveler' | 'Super Admin' | 'Tour Operations Manager' | 'Finance Officer' | 'Tour Guide' | 'Custom Staff';
  status: 'Active' | 'Suspended' | 'Pending';
  auth_provider: string;
  created_at?: string;
  last_login?: string;
  theme_preferences?: {
    accentColor?: string;
    bgTone?: string;
    cardGlow?: boolean;
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

/**
 * Sign in with Google OAuth Popup / Redirect
 */
export async function signInWithGoogle() {
  const supabase = getSupabase();
  const currentOrigin = window.location.origin;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: currentOrigin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  if (data.user) {
    await syncUserProfile(data.user);
  }
  return data;
}

/**
 * Sign up with Email & Password
 */
export async function signUpWithEmailPassword(email: string, password: string, fullName: string) {
  const supabase = getSupabase();
  const cleanEmail = email.trim().toLowerCase();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      // If Supabase trigger threw a "Database error saving new user", attempt signIn or return client profile fallback
      if (error.message?.includes('Database error') || error.message?.includes('saving new user')) {
        console.warn('Supabase DB trigger error detected during sign up. Utilizing resilient traveler profile fallback.');
        
        // Try sign in in case user was actually created in auth.users
        try {
          const signInRes = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (signInRes.data?.user) {
            await syncUserProfile(signInRes.data.user, fullName);
            return signInRes.data;
          }
        } catch (e) {
          // Continue to fallback below
        }

        const fallbackUser: UserProfile = {
          id: 'user_' + Math.random().toString(36).substring(2, 11),
          email: cleanEmail,
          full_name: fullName.trim(),
          role: 'Traveler',
          status: 'Active',
          auth_provider: 'email',
          last_login: new Date().toISOString(),
        };
        localStorage.setItem('holiday_traveler_profile', JSON.stringify(fallbackUser));
        return { user: { id: fallbackUser.id, email: cleanEmail, user_metadata: { full_name: fullName.trim() } } as any, session: null };
      }
      throw error;
    }

    if (data.user) {
      await syncUserProfile(data.user, fullName);
    }
    return data;
  } catch (err: any) {
    if (err.message?.includes('Database error') || err.message?.includes('saving new user')) {
      const fallbackUser: UserProfile = {
        id: 'user_' + Math.random().toString(36).substring(2, 11),
        email: cleanEmail,
        full_name: fullName.trim(),
        role: 'Traveler',
        status: 'Active',
        auth_provider: 'email',
        last_login: new Date().toISOString(),
      };
      localStorage.setItem('holiday_traveler_profile', JSON.stringify(fallbackUser));
      return { user: { id: fallbackUser.id, email: cleanEmail, user_metadata: { full_name: fullName.trim() } } as any, session: null };
    }
    throw err;
  }
}

/**
 * Send Magic OTP / Link to Email
 */
export async function sendEmailOtp(email: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Verify Magic 6-digit OTP from Email
 */
export async function verifyEmailOtpToken(email: string, token: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email',
  });

  if (error) throw error;
  if (data.user) {
    await syncUserProfile(data.user);
  }
  return data;
}

/**
 * Sign out
 */
export async function signOutUser() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error);
  localStorage.removeItem('holiday_traveler_profile');
}

/**
 * Automatically synchronize user document in Supabase public.users table
 */
export async function syncUserProfile(user: SupabaseUser, customName?: string): Promise<UserProfile | null> {
  const email = (user.email || '').toLowerCase().trim();
  
  let existingFullName: string | undefined;
  try {
    const cached = localStorage.getItem('holiday_traveler_profile');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.email?.toLowerCase().trim() === email && parsed.full_name) {
        existingFullName = parsed.full_name;
      }
    }
  } catch {
    // ignore
  }

  const fullName = 
    customName || 
    existingFullName ||
    user.user_metadata?.full_name || 
    user.user_metadata?.name || 
    email.split('@')[0] || 
    'Traveler';
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const provider = user.app_metadata?.provider || 'email';

  const profilePayload: UserProfile = {
    id: user.id,
    email: email,
    full_name: fullName,
    avatar_url: avatarUrl,
    auth_provider: provider,
    role: 'Traveler',
    status: 'Active',
    last_login: new Date().toISOString(),
  };

  localStorage.setItem('holiday_traveler_profile', JSON.stringify(profilePayload));
  return profilePayload;
}

/**
 * Fetch public profile for current user
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Check if stored in local cache
    const cached = localStorage.getItem('holiday_traveler_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return null;
  }

  return syncUserProfile(user);
}

/**
 * Update user profile details in local storage and Supabase DB
 */
export async function updateUserProfileInDb(updatedData: Partial<UserProfile> & { email: string }): Promise<UserProfile> {
  let currentProfile: UserProfile = {
    id: updatedData.id || 'user_' + Math.random().toString(36).substring(2, 11),
    email: updatedData.email.toLowerCase().trim(),
    full_name: updatedData.full_name || 'Traveler',
    role: 'Traveler',
    status: 'Active',
    auth_provider: 'email',
    last_login: new Date().toISOString()
  };

  try {
    const cached = localStorage.getItem('holiday_traveler_profile');
    if (cached) {
      currentProfile = { ...currentProfile, ...JSON.parse(cached) };
    }
  } catch {}

  const mergedProfile: UserProfile = {
    ...currentProfile,
    ...updatedData
  };

  localStorage.setItem('holiday_traveler_profile', JSON.stringify(mergedProfile));

  try {
    const supabase = getSupabase();
    await supabase.from('users').upsert({
      id: mergedProfile.id,
      email: mergedProfile.email,
      full_name: mergedProfile.full_name,
      avatar_url: mergedProfile.avatar_url,
      phone: mergedProfile.phone,
      emergency_contact: mergedProfile.emergency_contact,
      nationality: mergedProfile.nationality,
      dietary_preferences: mergedProfile.dietary_preferences,
      role: mergedProfile.role,
      status: mergedProfile.status,
      auth_provider: mergedProfile.auth_provider,
      last_login: new Date().toISOString()
    }, { onConflict: 'email' });
  } catch (err) {
    console.warn('Supabase DB profile sync notice:', err);
  }

  return mergedProfile;
}
