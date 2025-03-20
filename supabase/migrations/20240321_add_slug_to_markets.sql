-- Add slug column to markets table (nullable initially)
ALTER TABLE markets ADD COLUMN slug TEXT;

-- Update any existing records with a generated slug based on their name
UPDATE markets 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s]', ''), '\s+', '-'));

-- Now make slug unique and not null after populating existing records
ALTER TABLE markets ADD CONSTRAINT markets_slug_key UNIQUE (slug);
ALTER TABLE markets ALTER COLUMN slug SET NOT NULL; 