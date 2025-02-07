drop policy "Enable users to view their own data only" on "public"."profiles";

create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);



