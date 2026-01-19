import { VercelRequest, VercelResponse } from '@vercel/node';

interface BrowseRequest {
  type: string;
  page?: number;
  genre?: string;
  query?: string;
}

interface BrowseResponse {
  results: any[];
  page: number;
  totalPages: number;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, page = 1, genre, query } = req.body as BrowseRequest;

    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    let url = '';
    
    if (query) {
      url = `https://api.themoviedb.org/3/search/${type}?api_key=${tmdbApiKey}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`;
    } else if (genre) {
      url = `https://api.themoviedb.org/3/discover/${type}?api_key=${tmdbApiKey}&language=es-ES&with_genres=${genre}&page=${page}&sort_by=popularity.desc`;
    } else {
      const endpoint = type === 'movie' ? 'movie' : 'tv';
      url = `https://api.themoviedb.org/3/${endpoint}/popular?api_key=${tmdbApiKey}&language=es-ES&page=${page}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return res.status(200).json({
      results: data.results || [],
      page: data.page || page,
      totalPages: data.total_pages || 1,
    });

  } catch (error) {
    console.error('Browse API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}