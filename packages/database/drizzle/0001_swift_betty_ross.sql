DROP INDEX IF EXISTS "idx_timezones_name";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_countries_code";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_timezones_name_unique" ON "timezones" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_countries_code_unique" ON "countries" ("code");