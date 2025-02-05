alter table "public"."short_urls" add column "updated_at" timestamp with time zone not null default now();


