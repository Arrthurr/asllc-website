-- Arturo Solo LLC: contact leads + blog schema
-- contact_leads: server-mediated inserts only (service_role)
-- posts: public read for published status

CREATE TABLE IF NOT EXISTS contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  service text CHECK (service IN ('ai-jumpstart', 'custom-ai-build', 'not-sure')),
  message text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  excerpt text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id uuid,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- contact_leads: no anon/authenticated policies; service_role inserts only
REVOKE ALL ON contact_leads FROM anon, authenticated;
GRANT INSERT, SELECT ON contact_leads TO service_role;

-- posts: public reads published only
CREATE POLICY "Public can read published posts"
  ON posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts (slug);
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts (status);
