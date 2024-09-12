<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-background"
  >
    <div class="bg-card p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
      <h2 class="text-2xl font-semibold text-center text-copy">
        Login / Signup
      </h2>
      <p class="text-center text-copy-secondary">
        Login using one of the following methods:
      </p>

      <!-- Google Login -->
      <Button
        class="w-full p-button-google border-none"
        @click="handleSocialLogin('google')"
      >
        <Icon class="iconify text-white" name="ph:google-logo"></Icon>
        <span class="text-white">Login with Google</span>
      </Button>

      <!-- Apple Login -->
      <Button
        label="Login with Apple"
        class="w-full p-button-apple border-none"
        @click="handleSocialLogin('apple')"
      >
        <Icon class="iconify text-white" name="ph:apple-logo"></Icon>
        <span class="text-white">Login with Apple</span>
      </Button>

      <!-- Facebook Login -->
      <Button
        label="Login with Facebook"
        class="w-full p-button-facebook border-none"
        @click="handleSocialLogin('facebook')"
      >
        <Icon class="iconify text-white" name="ph:facebook-logo"></Icon>
        <span class="text-white">Login with Facebook</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

const email = ref("");
const password = ref("");

const { handleSocialLogin } = useUserStore();
</script>

<style scoped>
/* Tailwind + PrimeVue styling */
.p-button-google {
  @apply bg-red-600 hover:bg-red-700;
}
.p-button-apple {
  @apply bg-black hover:bg-gray-900;
}
.p-button-facebook {
  @apply bg-blue-600 hover:bg-blue-700;
}
</style>
