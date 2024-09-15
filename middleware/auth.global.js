export default defineNuxtRouteMiddleware(async (to, _from) => {
  const session = useSupabaseSession();

  if (to.path.startsWith("/app/")) {
    //accessing protected route
    if (!session.value) {
      //not logged in
      return navigateTo("/auth/login");
    } else {
      //logged in, check if signup is complete
      const userStore = useUserStore();
      const user = await userStore.getUserData();

      console.log(user.userData.signup_progress);
      if (user.userData.signup_progress < 2) {
        return navigateTo("/auth/signup");
      }
    }
  } else {
  }
});
