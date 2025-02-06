create policy "allow anon users to read from bucket owed4n_0"
on "storage"."objects"
as permissive
for select
to anon
using ((bucket_id = 'inspector-screenshots'::text));


create policy "allow authenticated roles to insert into bucket owed4n_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'inspector-screenshots'::text));



