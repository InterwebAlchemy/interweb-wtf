drop policy "Enable users to view their own data only" on "public"."short_urls";

create policy "Enable read access for all users"
on "public"."short_urls"
as permissive
for select
to public
using (true);



