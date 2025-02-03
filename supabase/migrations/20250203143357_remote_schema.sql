drop function if exists "public"."update_invite_status"(username text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_invite_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  UPDATE public.invited_users SET 
    accepted_on = now(),
    accepted = true
  WHERE
    invited_users.username = new.username;
end;$function$
;

CREATE TRIGGER update_invited_status AFTER INSERT ON public.profiles FOR EACH STATEMENT EXECUTE FUNCTION update_invite_status();


