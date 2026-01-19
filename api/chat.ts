import { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatRequest {
  prompt: string;
  context?: string;
  movieData?: any;
  cast?: any[];
}

interface ChatResponse {
  response: string;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, context, movieData, cast } = req.body as ChatRequest;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    let systemPrompt = 'Eres un experto cinéfilo.';
    
    if (movieData && cast) {
      const castNames = cast.map((a: any) => `${a.name} (${a.character})`).join(', ');
      systemPrompt = `Eres un experto cinéfilo hablando sobre "${movieData.title || movieData.name}". Datos: Reparto: ${castNames}. Sinopsis: ${movieData.overview}. Reglas: Sé breve, entusiasta y no inventes datos.`;
    } else if (context) {
      systemPrompt = `Sos un cinéfilo experto hablando con un amigo. Contexto: ${context}. REGLAS: Responde informal, breve y no inventes.`;
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No se pudo generar respuesta.';

    return res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}