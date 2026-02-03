import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface FavoriteRequest {
  action: 'check' | 'toggle' | 'list';
  movieId?: string;
  movieTitle?: string;
  posterPath?: string;
  userId?: string;
}

interface FavoriteResponse {
  isFavorite?: boolean;
  favorites?: any[];
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, movieId, movieTitle, posterPath, userId } = req.body as FavoriteRequest;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify authentication
    const authHeader = req.headers.authorization;
    let currentUser: any = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      currentUser = user;
    } else {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // Verify that the userId in the request matches the authenticated user
    if (userId !== currentUser.id) {
      return res.status(403).json({ error: 'Forbidden: User ID mismatch' });
    }

    // Test table access
    console.log('Testing table access for user:', currentUser.id);

    switch (action) {
      case 'check':
        if (!movieId || !userId) {
          return res.status(400).json({ error: 'Movie ID and User ID are required' });
        }
        const { data: fav } = await supabase
          .from('favoritos')
          .select('*')
          .eq('user_id', userId)
          .eq('movie_id', movieId)
          .single();
        return res.status(200).json({ isFavorite: !!fav });

      case 'toggle':
        if (!movieId || !userId || !movieTitle) {
          return res.status(400).json({ error: 'Movie ID, User ID, and Movie Title are required' });
        }
        
        const { data: existingFav, error: fetchError } = await supabase
          .from('favoritos')
          .select('*')
          .eq('user_id', userId)
          .eq('movie_id', movieId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking existing favorite:', fetchError);
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingFav) {
          const { error: deleteError } = await supabase
            .from('favoritos')
            .delete()
            .eq('user_id', userId)
            .eq('movie_id', movieId);
          
          if (deleteError) {
            console.error('Error deleting favorite:', deleteError);
            return res.status(500).json({ error: 'Failed to remove favorite' });
          }
          
          return res.status(200).json({ isFavorite: false });
        } else {
          const insertData = {
            user_id: userId,
            movie_id: movieId,
            movie_title: movieTitle,
            poster_path: posterPath,
          };
          
          console.log('Inserting favorite:', insertData);
          
          const { error: insertError } = await supabase
            .from('favoritos')
            .insert([insertData]);
          
          if (insertError) {
            console.error('Error inserting favorite:', insertError);
            console.error('Error details:', {
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
              code: insertError.code
            });
            return res.status(500).json({ 
              error: 'Failed to add favorite',
              details: insertError.message,
              code: insertError.code
            });
          }
          
          return res.status(200).json({ isFavorite: true });
        }

      case 'list':
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        const { data: favorites } = await supabase
          .from('favoritos')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        return res.status(200).json({ favorites: favorites || [] });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Favorites API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}