create table "public"."invited_users" (
    "id" bigint generated by default as identity not null,
    "username" character varying not null,
    "accepted" boolean not null default false,
    "invited_on" timestamp with time zone not null default now(),
    "accepted_on" timestamp with time zone
);


alter table "public"."invited_users" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "username" character varying not null,
    "avatar_url" character varying,
    "created_at" timestamp with time zone not null default now(),
    "last_seen" timestamp with time zone not null default now()
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX invited_users_pkey ON public.invited_users USING btree (id);

CREATE UNIQUE INDEX invited_users_username_key ON public.invited_users USING btree (username);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."invited_users" add constraint "invited_users_pkey" PRIMARY KEY using index "invited_users_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."invited_users" add constraint "invited_users_username_key" UNIQUE using index "invited_users_username_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  if (
      SELECT COUNT(*) FROM public.invited_users AS I WHERE I.username = 'ericrallen' AND I.accepted = false
    ) THEN 
      INSERT INTO public.profiles (id, username, avatar_url)
      values (
        new.id,
        new.raw_user_meta_data ->> 'preferred_username',
        new.raw_user_meta_data ->> 'avatar_url'
      )
      ON CONFLICT (id) 
      DO 
        UPDATE SET
          username = new.raw_user_meta_data ->> 'preferred_username',
          avatar_url = new.raw_user_meta_data ->> 'avatar_url';
      return new;
    ELSE
      RAISE EXCEPTION 'User must be invited';
    END if;
end;$function$
;

grant delete on table "public"."invited_users" to "anon";

grant insert on table "public"."invited_users" to "anon";

grant references on table "public"."invited_users" to "anon";

grant select on table "public"."invited_users" to "anon";

grant trigger on table "public"."invited_users" to "anon";

grant truncate on table "public"."invited_users" to "anon";

grant update on table "public"."invited_users" to "anon";

grant delete on table "public"."invited_users" to "authenticated";

grant insert on table "public"."invited_users" to "authenticated";

grant references on table "public"."invited_users" to "authenticated";

grant select on table "public"."invited_users" to "authenticated";

grant trigger on table "public"."invited_users" to "authenticated";

grant truncate on table "public"."invited_users" to "authenticated";

grant update on table "public"."invited_users" to "authenticated";

grant delete on table "public"."invited_users" to "service_role";

grant insert on table "public"."invited_users" to "service_role";

grant references on table "public"."invited_users" to "service_role";

grant select on table "public"."invited_users" to "service_role";

grant trigger on table "public"."invited_users" to "service_role";

grant truncate on table "public"."invited_users" to "service_role";

grant update on table "public"."invited_users" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."users"
as restrictive
for delete
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on email"
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Enable users to view their own data only"
on "public"."users"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));



