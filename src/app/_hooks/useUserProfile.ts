'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/app/_adapters/supabase/client';
import { Tables } from '@/types/supabase';

export default function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const supabase = await createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (typeof user !== 'undefined' && user !== null) {
          setUser(user);

          const { data: profileData } = await supabase.from('profiles').select().eq('id', user?.id);

          if (typeof profileData !== 'undefined' && profileData !== null) {
            setProfile(profileData[0]);
          }
        }
      } catch (error) {
        console.error('GETUSER EXCEPTION:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, profile, loading };
}
