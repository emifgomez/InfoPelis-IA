import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface MovieReviewsRequest {
  movieId: string;
  action: 'list' | 'create' | 'delete';
  reviewData?: {
    user_id: string;
    user_email: string;
    rating: number;
    content: string;
    movie_title: string;
  };
  reviewId?: string;
}

interface MovieReviewsResponse {
  reviews?: any[];
  success?: boolean;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { movieId, action, reviewData, reviewId } = req.body as MovieReviewsRequest;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Create admin client that bypasses RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });

    // Verify authentication for operations that need it
    if (action !== 'list') {
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

      // Verify that the user ID matches
      if (action === 'create' && reviewData?.user_id !== currentUser.id) {
        return res.status(403).json({ error: 'Forbidden: User ID mismatch' });
      }
    }

    switch (action) {
      case 'list':
        const { data: reviews, error: listError } = await supabase
          .from('reviews')
          .select('*')
          .eq('movie_id', movieId)
          .order('created_at', { ascending: false });
        
        if (listError) {
          throw new Error(`Supabase error: ${listError.message}`);
        }
        return res.status(200).json({ reviews: reviews || [] });

      case 'create':
        if (!reviewData) {
          return res.status(400).json({ error: 'Review data is required' });
        }
        
        const reviewInsertData = {
          movie_id: movieId,
          ...reviewData,
        };

        const { error: insertError } = await supabase
          .from('reviews')
          .insert([reviewInsertData]);

        if (insertError && insertError.code === '42501') {
          console.log('RLS blocking review insert, trying bypass client...');
          
          const bypassClient = createClient(supabaseUrl, supabaseServiceRoleKey);
          
          const { error: bypassError } = await bypassClient
            .from('reviews')
            .insert([reviewInsertData]);
            
          if (bypassError) {
            return res.status(500).json({ 
              error: 'Failed to create review - RLS policy blocking',
              details: 'Row Level Security is blocking review creation'
            });
          }
        } else if (insertError) {
          return res.status(500).json({ 
            error: 'Failed to create review',
            details: insertError.message
          });
        }
        return res.status(200).json({ success: true });

      case 'delete':
        if (!reviewId) {
          return res.status(400).json({ error: 'Review ID is required' });
        }
        
        const { error: deleteError } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);

        if (deleteError && deleteError.code === '42501') {
          console.log('RLS blocking review delete, trying bypass client...');
          
          const bypassClient = createClient(supabaseUrl, supabaseServiceRoleKey);
          
          const { error: bypassError } = await bypassClient
            .from('reviews')
            .delete()
            .eq('id', reviewId);
            
          if (bypassError) {
            return res.status(500).json({ 
              error: 'Failed to delete review - RLS policy blocking',
              details: 'Row Level Security is blocking review deletion'
            });
          }
        } else if (deleteError) {
          return res.status(500).json({ 
            error: 'Failed to delete review',
            details: deleteError.message
          });
        }
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Movie reviews API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}