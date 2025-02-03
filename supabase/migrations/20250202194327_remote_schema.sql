drop policy "Enable delete for users based on user_id" on "public"."users";

drop policy "Enable insert for authenticated users only" on "public"."users";

drop policy "Enable update for users based on email" on "public"."users";

drop policy "Enable users to view their own data only" on "public"."users";

revoke delete on table "public"."users" from "anon";

revoke insert on table "public"."users" from "anon";

revoke references on table "public"."users" from "anon";

revoke select on table "public"."users" from "anon";

revoke trigger on table "public"."users" from "anon";

revoke truncate on table "public"."users" from "anon";

revoke update on table "public"."users" from "anon";

revoke delete on table "public"."users" from "authenticated";

revoke insert on table "public"."users" from "authenticated";

revoke references on table "public"."users" from "authenticated";

revoke select on table "public"."users" from "authenticated";

revoke trigger on table "public"."users" from "authenticated";

revoke truncate on table "public"."users" from "authenticated";

revoke update on table "public"."users" from "authenticated";

revoke delete on table "public"."users" from "service_role";

revoke insert on table "public"."users" from "service_role";

revoke references on table "public"."users" from "service_role";

revoke select on table "public"."users" from "service_role";

revoke trigger on table "public"."users" from "service_role";

revoke truncate on table "public"."users" from "service_role";

revoke update on table "public"."users" from "service_role";

alter table "public"."users" drop constraint "users_id_fkey";

alter table "public"."users" drop constraint "users_username_key";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."users_pkey";

drop index if exists "public"."users_username_key";

drop table "public"."users";

create table "public"."profiles" (
    "id" uuid not null,
    "username" character varying not null,
    "avatar_url" character varying,
    "created_at" timestamp with time zone not null default now(),
    "last_seen" timestamp with time zone not null default now(),
    "first_visit" boolean not null default true
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.profiles USING btree (username);

alter table "public"."profiles" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."profiles" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "users_id_fkey";

alter table "public"."profiles" add constraint "users_username_key" UNIQUE using index "users_username_key";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."profiles"
as restrictive
for delete
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on email"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Enable users to view their own data only"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));



