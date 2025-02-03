set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_for_invite()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  was_invited bool;
  new_username varchar;
BEGIN
  new_username := new.raw_user_meta_data ->> 'preferred_username';
  
  SELECT INTO was_invited FROM public.invited_users AS I WHERE I.username = new_username AND I.accepted = false ORDER BY I.invited_on LIMIT 1;

  if (FOUND) then
    UPDATE public.invited_users SET 
        accepted_on = now(),
        accepted = true
      WHERE
        username = new_username;

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
AS $function$begin
  INSERT INTO public.profiles (id, username, avatar_url)
    values (
      new.id,
      new_username,
      new.raw_user_meta_data ->> 'avatar_url'
    )
  ON CONFLICT (id) 
  DO 
    UPDATE SET
      username = new.raw_user_meta_data ->> 'preferred_username',
      avatar_url = new.raw_user_meta_data ->> 'avatar_url';
  return new;
end;$function$
;


