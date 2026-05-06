import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const config = {
  api: { bodyParser: false }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Rylo Health <hello@rylohealth.com>';

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing signature' });

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.metadata?.tier !== 'founder') {
      return res.status(200).json({ received: true, skipped: 'not_founder_tier' });
    }

    const email = session.customer_details?.email || session.customer_email || '';
    if (!email) {
      console.error('webhook: no email on completed session', session.id);
      return res.status(200).json({ received: true, skipped: 'no_email' });
    }

    try {
      const { error: insertErr } = await supabase
        .from('founders')
        .insert({
          email,
          stripe_session_id: session.id,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
          payment_status: session.payment_status || 'unknown'
        });

      // 23505 = unique_violation; webhook may retry — treat as already-processed
      const alreadyProcessed = insertErr && insertErr.code === '23505';
      if (insertErr && !alreadyProcessed) {
        console.error('founders insert error', insertErr);
        return res.status(500).json({ error: 'DB insert failed' });
      }

      const { count } = await supabase
        .from('founders')
        .select('*', { count: 'exact', head: true });
      const founderNumber = count || 1;

      if (!alreadyProcessed) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "You're in. Welcome to the Founders' Circle.",
          html: buildWelcomeHTML(founderNumber)
        });
      }

      return res.status(200).json({ received: true, founder_number: founderNumber });
    } catch (err) {
      console.error('webhook handler error', err);
      return res.status(500).json({ error: 'Handler failed' });
    }
  }

  return res.status(200).json({ received: true });
}

function buildWelcomeHTML(num) {
  const padded = String(num).padStart(2, '0');
  return `
<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a;line-height:1.6;">
  <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:500;letter-spacing:-0.02em;line-height:1.1;margin:0 0 8px;">You're in. <em style="color:rgba(26,26,26,0.6);font-weight:400;">Welcome to the Founders' Circle.</em></h1>
  <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-style:italic;color:#C4724A;margin:24px 0 28px;">Founder #${padded} of 50.</p>
  <p style="font-size:15px;line-height:1.7;margin:0 0 16px;color:rgba(26,26,26,0.78);">Your rate is locked. For as long as you remain a member in good standing, you pay:</p>
  <table style="width:100%;border-collapse:collapse;margin:8px 0 28px;">
    <tr><td style="padding:14px 0;border-bottom:1px solid rgba(0,0,0,0.08);font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;">Tirzepatide</td><td style="padding:14px 0;border-bottom:1px solid rgba(0,0,0,0.08);text-align:right;font-weight:500;font-family:'Inter',sans-serif;">$160<span style="color:rgba(0,0,0,0.5);font-weight:400;">/mo</span></td></tr>
    <tr><td style="padding:14px 0;font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;">Semaglutide</td><td style="padding:14px 0;text-align:right;font-weight:500;font-family:'Inter',sans-serif;">$100<span style="color:rgba(0,0,0,0.5);font-weight:400;">/mo</span></td></tr>
  </table>
  <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:500;letter-spacing:-0.01em;margin:32px 0 12px;">What's next.</h2>
  <p style="font-size:15px;line-height:1.7;margin:0 0 24px;color:rgba(26,26,26,0.78);">We'll email you the moment doors open. Your rate is locked, forever.</p>
  <p style="font-size:11px;line-height:1.7;margin:40px 0 0;color:rgba(26,26,26,0.45);border-top:1px solid rgba(0,0,0,0.08);padding-top:24px;">Founders' Circle membership grants locked pricing only. Medication requires licensed provider review and clinical eligibility. Compounded medications are not FDA-approved and have not been evaluated by the FDA. Refundable within 30 days. Fully refundable if Rylo does not launch by December 31, 2026. — Rylo Health LLC</p>
</div>`;
}
