/**
 * Auth/session store. Holds the bearer token + cached user in memory, and
 * persists them (token → keychain, user → AsyncStorage). The API client reads
 * the token from here via `useAuthStore.getState()`.
 */
import {create} from 'zustand';
import * as secure from '../../lib/storage/secureStorage';
import * as appStorage from '../../lib/storage/appStorage';
import {User} from '../../types/api';

const USER_KEY = 'auth.user';

type AuthState = {
  token: string | null;
  user: User | null;
  /** false until hydrate() has run once on boot */
  isHydrated: boolean;
  setSession: (token: string, user: User) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  clear: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,

  setSession: async (token, user) => {
    // Update in-memory state FIRST so navigation reacts immediately; persistence
    // is best-effort and must never block or break the session.
    set({token, user});
    await secure.saveToken(token);
    await appStorage.setJSON(USER_KEY, user);
  },

  setUser: async (user) => {
    set({user});
    await appStorage.setJSON(USER_KEY, user);
  },

  clear: async () => {
    set({token: null, user: null});
    await secure.clearToken();
    await appStorage.remove(USER_KEY);
  },

  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([
        secure.getToken(),
        appStorage.getJSON<User>(USER_KEY),
      ]);
      set({token, user, isHydrated: true});
    } catch (err) {
      // Never let boot hydration throw — degrade to logged-out.
      console.warn('[authStore] hydrate failed', err);
      set({token: null, user: null, isHydrated: true});
    }
  },
}));

/** Convenience selectors (use outside React via useAuthStore.getState()). */
export const selectIsAuthenticated = (s: AuthState) => !!s.token;
export const selectIsOnboarded = (s: AuthState) => !!s.user?.onboard_date;
