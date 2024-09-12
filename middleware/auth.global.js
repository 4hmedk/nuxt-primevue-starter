export default defineNuxtRouteMiddleware(async (to, _from) => {
  const session = useSupabaseSession();

  if (!session.value && to.path.startsWith("/app/")) {
    return navigateTo("/auth/login");
  } else {
    const userStore = useUserStore();
    const user = await userStore.getUserData();

    console.log(user.userData.signup_progress);
  }
});
