<template>
  <p class="text-3xl font-bold text-copy">{{ app_title }}</p>
</template>

<script setup>
const app_title = process.env.APP_TITLE;
</script>

<style scoped></style>
