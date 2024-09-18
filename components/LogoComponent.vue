<template>
  <p class="text-3xl font-bold text-copy">{{ app_title }}</p>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const app_title = runtimeConfig.public.APP_TITLE;
</script>

<style scoped></style>
