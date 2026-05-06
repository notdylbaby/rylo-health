import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (process.env.STRIPE_LIVE !== 'true') {
    return res.status(403).json({ error: 'Stripe checkout not yet enabled' });
  }

  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const origin = req.headers.origin || `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: "Founders' Circle Membership",
            description: "Lifetime locked pricing on compounded GLP-1 protocols. One-time fee. Refundable per terms."
          },
          unit_amount: 14900
        },
        quantity: 1
      }],
      metadata: { tier: 'founder' },
      success_url: `${origin}/founder-thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/waitlist.html#founders`,
      submit_type: 'pay',
      allow_promotion_codes: false
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
