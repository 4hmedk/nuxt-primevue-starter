export const useUserStore = defineStore("supabase", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userData: (state) => state.user?.userData,
  },

  actions: {
    async handleLogin(email, password) {
      this.loading = true;
      this.error = null;
      const supabase = useSupabaseClient();
      const router = useRouter();

      try {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });
        if (authError) throw authError;
        this.user = data.user;
        router.push("/app/");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async handleSignup(email, password, userData) {
      this.loading = true;
      this.error = null;
      const supabase = useSupabaseClient();
      const router = useRouter();

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
        this.user = data.user;
        router.push("/app/");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async handleSocialLogin(provider) {
      this.loading = true;
      this.error = null;
      const supabase = useSupabaseClient();

      try {
        const { error: authError } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/redirect`,
          },
        });
        if (authError) throw authError;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async handleLogout() {
      this.loading = true;
      this.error = null;
      const supabase = useSupabaseClient();
      const router = useRouter();

      try {
        const { error: authError } = await supabase.auth.signOut();
        if (authError) throw authError;
        this.user = null;
        router.push("/auth/login");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async getUserData() {
      const supabase = useSupabaseClient();

      try {
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        this.user = data.user;
        console.log(this.user.id);
        const { data: userData, e } = await supabase
          .from("starter-userdata")
          .select("*")
          .eq("id", this.user.id);
        if (e && e.code !== "PGRST116") {
          console.error("Error fetching user metadata:", e);
          throw e;
        }
        if (userData[0]) {
          // User exists, return the metadata
          this.user.userData = userData[0];
          return this.user;
        } else {
          // User doesn't exist, create new entry
          const newUserData = {
            id: this.user.id,
            email: this.user.email,
            created_at: new Date().toISOString(),
            // Add any other initial metadata fields you want
          };
          const { data: insertedData, error: insertError } = await supabase
            .from("starter-userdata")
            .insert(newUserData);
          if (insertError) {
            console.error("Error creating new user metadata:", insertError);
            throw insertError;
          }
          this.user.userData = insertedData[0];
          return this.user;
        }
      } catch (e) {
        console.log(e.message);
        this.error = error.message;
      }
    },
  },
});
