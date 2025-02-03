set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_for_invite()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  was_invited bool;
BEGIN
  SELECT INTO was_invited FROM public.invited_users WHERE invited_users.username = new.raw_user_meta_data ->> 'preferred_username' AND accepted = false ORDER BY invited_on LIMIT 1;

  if (FOUND) then
    return new;
  else
    RAISE EXCEPTION 'User must be invited';

    return null;
  end if;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
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

  UPDATE public.invited_users SET 
    accepted_on = now(),
    accepted = true
  WHERE
    invited_users.username = new.raw_user_meta_data ->> 'preferred_username';

  return new;
end;$function$
;


