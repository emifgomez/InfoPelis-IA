import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface SearchRequest {
  query: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface SearchResponse {
  tmdbResults: TMDBMovie[];
  aiRecommendation: string;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body as SearchRequest;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required and must be a non-empty string' });
    }

    // Environment variables
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Validate environment variables
    if (!tmdbApiKey || !mistralApiKey || !supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Search movies in TMDB
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API error: ${tmdbResponse.statusText}`);
    }

    const tmdbData = await tmdbResponse.json();
    const tmdbResults: TMDBMovie[] = tmdbData.results || [];

    // Generate AI recommendation using Mistral
    let aiRecommendation = '';
    if (tmdbResults.length > 0) {
      const movieTitles = tmdbResults.slice(0, 5).map((movie: TMDBMovie) => 
        `${movie.title} (${movie.release_date?.split('-')[0] || 'Unknown'}) - ${movie.overview?.substring(0, 100)}...`
      ).join('\n');

      const mistralPrompt = `Based on these search results for "${query}":

${movieTitles}

Provide a brief, helpful recommendation (under 150 words) about what to watch from this list. Focus on the most relevant options and why someone interested in "${query}" might enjoy them.`;

      const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mistralApiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-tiny',
          messages: [
            {
              role: 'user',
              content: mistralPrompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!mistralResponse.ok) {
        console.error('Mistral API error:', mistralResponse.statusText);
        aiRecommendation = 'AI recommendation temporarily unavailable.';
      } else {
        const mistralData = await mistralResponse.json();
        aiRecommendation = mistralData.choices?.[0]?.message?.content || 'Unable to generate recommendation.';
      }
    } else {
      aiRecommendation = `No movies found for "${query}". Try a different search term.`;
    }

    // Log the search to Supabase (optional)
    try {
      await supabase
        .from('search_logs')
        .insert({
          query,
          results_count: tmdbResults.length,
          created_at: new Date().toISOString(),
        });
    } catch (logError) {
      console.error('Failed to log search to Supabase:', logError);
      // Continue even if logging fails
    }

    // Return response
    const response: SearchResponse = {
      tmdbResults,
      aiRecommendation,
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}