<template>
  <div class="text-copy">you are being redirected</div>
</template>

<script setup>
const supabase = useSupabaseClient();

onMounted(async () => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    // Session is now confirmed, redirect to the originally requested page

    // Get redirect path from cookies
    const cookieName = useRuntimeConfig().public.supabase.cookieName;
    const redirectPath = useCookie(`${cookieName}-redirect-path`).value;
    if (redirectPath) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null;
      // Redirect to path
      navigateTo(redirectPath || "/");
    } else {
      navigateTo("/app/home");
    }
  } catch (error) {
    console.error("Error confirming session:", error.message);
    navigateTo("/auth/login");
  }
});

definePageMeta({
  layout: "minimal",
});
</script>
