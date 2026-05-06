-- Rylo Health · Founders' Circle table
-- Run this once in the Supabase SQL editor.

-- IMPORTANT: the existing `founders` table on the project currently uses the
-- old email/zip/product_interest schema from waitlist.html. Decide one path:
--   (A) drop & recreate (loses existing reservation rows)
--   (B) rename old to founders_legacy, create new
-- Uncomment ONE of the following blocks before running:

-- (A) Drop & recreate (destructive):
-- DROP TABLE IF EXISTS public.founders CASCADE;

-- (B) Preserve old rows under a new name (non-destructive):
-- ALTER TABLE IF EXISTS public.founders RENAME TO founders_legacy;

CREATE TABLE IF NOT EXISTS public.founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS founders_email_idx ON public.founders(email);
CREATE INDEX IF NOT EXISTS founders_created_idx ON public.founders(created_at DESC);

ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
-- No public RLS policies — all access is via service role from /api/* routes only.
