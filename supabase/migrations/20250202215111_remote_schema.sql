alter table "public"."invited_users" add column "email" text not null;

CREATE UNIQUE INDEX invited_users_email_key ON public.invited_users USING btree (email);

alter table "public"."invited_users" add constraint "invited_users_email_key" UNIQUE using index "invited_users_email_key";

create policy "Enable read access for all users"
on "public"."invited_users"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."invited_users"
as permissive
for update
to public
using (((( SELECT auth.jwt() AS jwt) ->> 'email'::text) = email))
with check (((( SELECT auth.jwt() AS jwt) ->> 'email'::text) = email));



