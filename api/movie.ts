import { VercelRequest, VercelResponse } from '@vercel/node';

interface MovieRequest {
  type: string;
  id: string;
}

interface MovieResponse {
  data: any;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, id } = req.body as MovieRequest;

    if (!type || !id) {
      return res.status(400).json({ error: 'Type and ID are required' });
    }

    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${tmdbApiKey}&language=es-ES&append_to_response=credits,videos`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json({ data });

  } catch (error) {
    console.error('Movie detail API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}