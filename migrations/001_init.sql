CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CREATE TYPE has no IF NOT EXISTS in Postgres — use a DO block instead
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'preferred_language') THEN
    CREATE TYPE preferred_language AS ENUM ('Hindi', 'Tamil', 'Telugu', 'Marathi', 'English');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  mobile      TEXT NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL,
  purpose     TEXT NOT NULL,
  language    preferred_language NOT NULL,
  status      application_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for the ?status= filter — runs on every dashboard load
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Index for ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);