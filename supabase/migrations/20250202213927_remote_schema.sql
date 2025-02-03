set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
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
end;
$function$
;


