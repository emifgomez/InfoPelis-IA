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

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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
        
        const { error: insertError } = await supabase
          .from('reviews')
          .insert([{
            movie_id: movieId,
            ...reviewData,
          }]);

        if (insertError) {
          throw new Error(`Supabase error: ${insertError.message}`);
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

        if (deleteError) {
          throw new Error(`Supabase error: ${deleteError.message}`);
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