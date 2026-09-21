// src/services/authService.ts

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || '';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';


// --------------------------------------------------
// Secure storage for Supabase login session
// --------------------------------------------------

const ExpoSecureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const item = await SecureStore.getItemAsync(key);

      return item ?? null;
    } catch (error) {
      console.error('[SecureStore] Get error:', error);

      return null;
    }
  },

  setItem: async (
    key: string,
    value: string
  ): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('[SecureStore] Set error:', error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('[SecureStore] Remove error:', error);
    }
  },
};


// --------------------------------------------------
// Create Supabase client
// --------------------------------------------------

const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStorage,

      autoRefreshToken: true,

      persistSession: true,

      detectSessionInUrl: false,
    },
  }
);


// --------------------------------------------------
// Authentication Service
// --------------------------------------------------

export const authService = {
  supabaseClient,


  // ------------------------------------------------
  // SIGN UP WITH EMAIL
  // ------------------------------------------------

  async signUpWithEmail(
    email: string,
    password: string
  ) {
    return await supabaseClient.auth.signUp({
      email,
      password,
    });
  },


  // ------------------------------------------------
  // SIGN IN WITH EMAIL
  // ------------------------------------------------

  async signInWithEmail(
    email: string,
    password: string
  ) {
    return await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
  },


  // ------------------------------------------------
  // SIGN IN WITH GOOGLE
  // ------------------------------------------------

  async signInWithGoogle() {
    try {
      console.log('[Google Auth] Starting Google login');

      // Where Google should send the user back
      const redirectTo = AuthSession.makeRedirectUri();

      console.log(
        '[Google Auth] Redirect URL:',
        redirectTo
      );


      // Ask Supabase for the Google login URL
      const { data, error } =
        await supabaseClient.auth.signInWithOAuth({
          provider: 'google',

          options: {
            redirectTo,
            skipBrowserRedirect: true,
          },
        });


      // Supabase error
      if (error) {
        console.error(
          '[Google Auth] Supabase error:',
          error
        );

        return {
          data: null,
          error,
        };
      }


      // No Google login URL returned
      if (!data.url) {
        const urlError = new Error(
          'Google login URL was not created'
        );

        console.error(
          '[Google Auth]',
          urlError
        );

        return {
          data: null,
          error: urlError,
        };
      }


      console.log(
        '[Google Auth] Opening Google login'
      );


      // Open Google login page
      const result =
        await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );


      console.log(
        '[Google Auth] Browser result:',
        result.type
      );


      // User successfully returned to the app
      if (result.type === 'success') {
        const url = new URL(result.url);


        // Supabase normally returns these tokens
        // after successful OAuth login
        const accessToken =
          url.searchParams.get('access_token');

        const refreshToken =
          url.searchParams.get('refresh_token');


        if (accessToken && refreshToken) {
          console.log(
            '[Google Auth] Setting Supabase session'
          );


          const {
            data: sessionData,
            error: sessionError,
          } = await supabaseClient.auth.setSession({
            access_token: accessToken,

            refresh_token: refreshToken,
          });


          if (sessionError) {
            console.error(
              '[Google Auth] Session error:',
              sessionError
            );
          } else {
            console.log(
              '[Google Auth] Login successful:',
              sessionData.user?.email
            );
          }


          return {
            data: sessionData,
            error: sessionError,
          };
        }


        const tokenError = new Error(
          'Google login completed but no session tokens were returned'
        );

        console.error(
          '[Google Auth]',
          tokenError
        );


        return {
          data: null,
          error: tokenError,
        };
      }


      // User closed/cancelled Google login
      console.log(
        '[Google Auth] Google login cancelled'
      );


      return {
        data: null,
        error: null,
      };

    } catch (error) {
      console.error(
        '[Google Auth] Unexpected error:',
        error
      );


      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error(
                'Google authentication failed'
              ),
      };
    }
  },


  // ------------------------------------------------
  // SIGN OUT
  // ------------------------------------------------

  async signOut() {
    return await supabaseClient.auth.signOut();
  },


  // ------------------------------------------------
  // GET CURRENT SESSION
  // ------------------------------------------------

  async getSession() {
    const { data, error } =
      await supabaseClient.auth.getSession();


    if (error) {
      console.error(
        '[Auth] Get session error:',
        error
      );

      return null;
    }


    return data.session ?? null;
  },
};