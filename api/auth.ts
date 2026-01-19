import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface AuthRequest {
  action: 'getUser' | 'signIn' | 'signUp' | 'signOut';
  email?: string;
  password?: string;
}

interface AuthResponse {
  user?: any;
  session?: any;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, email, password } = req.body as AuthRequest;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    switch (action) {
      case 'getUser':
        const { data: { user } } = await supabase.auth.getUser();
        return res.status(200).json({ user });

      case 'signIn':
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          return res.status(400).json({ error: signInError.message });
        }
        return res.status(200).json({ user: signInData.user, session: signInData.session });

      case 'signUp':
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          return res.status(400).json({ error: signUpError.message });
        }
        return res.status(200).json({ user: signUpData.user, session: signUpData.session });

      case 'signOut':
        await supabase.auth.signOut();
        return res.status(200).json({});

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}