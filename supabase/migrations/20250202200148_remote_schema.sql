set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_for_invite()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  was_invited bool;
  new_username varchar;
BEGIN
  new_username := new.raw_user_meta_data ->> 'preferred_username';
  
  SELECT INTO was_invited FROM public.invited_users WHERE invited_users.username = new_username AND accepted = false ORDER BY invited_on LIMIT 1;

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


