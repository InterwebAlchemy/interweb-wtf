CREATE TRIGGER on_before_user_created BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION check_for_invite();

CREATE TRIGGER on_user_created AFTER INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


