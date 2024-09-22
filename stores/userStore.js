export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    app_name: useRuntimeConfig().public.APP_NAME || "starter",
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
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

    async getUserData(refresh = false) {
      //if data has already been fetched
      if (!refresh && this.user && this.user.userData) return this.user;

      //fetch data
      const supabase = useSupabaseClient();
      try {
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        this.user = data.user;
        const query = `*, ${this.app_name}-plans(*)`;
        const { data: userData, e } = await supabase
          .from(`${this.app_name}-userdata`)
          .select(query)
          .eq("id", this.user.id);
        if (e && e.code !== "PGRST116") {
          console.error("Error fetching user metadata:", e);
          throw e;
        }
        if (userData[0]) {
          // User exists,
          //rename the plans field
          const newUserData = userData[0];
          newUserData["plans"] = newUserData[`${this.app_name}-plans`];
          delete newUserData[`${this.app_name}-plans`];
          // return the metadata
          this.user.userData = newUserData;
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
            .from(`${this.app_name}-userdata`)
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
        this.error = e.message;
        return null;
      }
    },
    async updateUserData({ newtags = null, newSignupProgress = 0 } = {}) {
      const supabase = useSupabaseClient();
      const updatedTags = { ...this.user.userData.tags, ...newtags };
      console.log(updatedTags);
      try {
        const { error: authError } = await supabase
          .from(`${this.app_name}-userdata`)
          .update({ tags: updatedTags, signup_progress: newSignupProgress })
          .eq("id", this.user.id);
        if (authError) throw authError;
        this.user.userData.tags = updatedTags;
        this.user.userData.signup_progress = newSignupProgress;
        return this.user;
      } catch (e) {
        console.log(e.message);
        this.error = e.message;
        return null;
      }
    },
  },
});
