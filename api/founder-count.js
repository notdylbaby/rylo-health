import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { count, error } = await supabase
      .from('founders')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;

    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
    return res.status(200).json({
      claimed: count || 0,
      cap: 50,
      stripe_live: process.env.STRIPE_LIVE === 'true'
    });
  } catch (err) {
    console.error('founder-count error', err);
    return res.status(500).json({ error: 'Failed to fetch count' });
  }
}
