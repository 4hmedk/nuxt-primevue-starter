// composables/useSupabase.js

export const useSupabase = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const handleLogin = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) throw authError;

      user.value = data.user;
      router.push("/app/");
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const handleSignup = async (email, password, userData) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            userdata: userData,
          },
        },
      });

      if (authError) throw authError;

      user.value = data.user;
      router.push("/app/");
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const handleSocialLogin = async (provider) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/redirect`,
        },
      });

      if (authError) throw authError;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const handleLogout = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;

      user.value = null;
      router.push("/auth/login");
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const getUserData = async () => {
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      user.value = data.user;
      console.log(user.value.id);

      const { data: userData, error } = await supabase
        .from("starter-userdata")
        .select("*")
        .eq("id", user.value.id);

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user metadata:", error);
        throw error;
      }
      if (userData[0]) {
        // User exists, return the metadata
        user.value.userData = userData[0];
        return user.value;
      } else {
        // User doesn't exist, create new entry
        const newUserData = {
          id: user.value.id,
          email: user.value.email,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          // Add any other initial metadata fields you want
        };

        const { data: insertedData, error: insertError } = await supabase
          .from("starter-userdata")
          .insert(newUserData);

        if (insertError) {
          console.error("Error creating new user metadata:", insertError);
          throw insertError;
        }
        user.value.userData = insertedData[0];
        return user.value;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return {
    user,
    loading,
    error,
    handleLogin,
    handleSignup,
    handleSocialLogin,
    handleLogout,
    getUserData,
  };
};
