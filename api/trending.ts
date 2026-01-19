import { VercelRequest, VercelResponse } from '@vercel/node';

interface TrendingResponse {
  results: any[];
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${tmdbApiKey}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json({ results: data.results?.slice(0, 5) || [] });

  } catch (error) {
    console.error('Trending API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}