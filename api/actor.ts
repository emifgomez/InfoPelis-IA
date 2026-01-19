import { VercelRequest, VercelResponse } from '@vercel/node';

interface ActorRequest {
  id: string;
}

interface ActorResponse {
  actor: any;
  movies: any[];
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body as ActorRequest;

    if (!id) {
      return res.status(400).json({ error: 'Actor ID is required' });
    }

    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const [actorResponse, moviesResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${tmdbApiKey}&language=es-ES`),
      fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${tmdbApiKey}&language=es-ES`)
    ]);

    if (!actorResponse.ok || !moviesResponse.ok) {
      throw new Error('TMDB API error');
    }

    const actor = await actorResponse.json();
    const moviesData = await moviesResponse.json();
    
    const topMovies = moviesData.cast
      .sort((a: any, b: any) => b.popularity - a.popularity)
      .slice(0, 18);

    return res.status(200).json({ actor, movies: topMovies });

  } catch (error) {
    console.error('Actor detail API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}