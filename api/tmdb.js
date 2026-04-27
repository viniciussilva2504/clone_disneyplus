// api/tmdb.js — Vercel Serverless Function
// Proxies TMDB requests so the bearer token stays server-side.
// Set TMDB_TOKEN in Vercel → Project Settings → Environment Variables.

const ALLOWED_TABS = {
  em_breve: 'https://api.themoviedb.org/3/movie/upcoming?language=pt-BR&region=BR&page=1',
  populares: 'https://api.themoviedb.org/3/movie/popular?language=pt-BR&region=BR&page=1',
  star_plus: 'https://api.themoviedb.org/3/trending/all/week?language=pt-BR',
};

export default async function handler(req, res) {
  const { tab } = req.query;

  if (!tab || !ALLOWED_TABS[tab]) {
    return res.status(400).json({ error: 'Invalid tab parameter.' });
  }

  const token = process.env.TMDB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'TMDB_TOKEN not configured.' });
  }

  try {
    const upstream = await fetch(ALLOWED_TABS[tab], {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream TMDB error.' });
    }

    const data = await upstream.json();

    // Cache for 1 hour at the CDN edge
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Failed to reach TMDB.' });
  }
}
