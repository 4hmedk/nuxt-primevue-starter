<template>
  <div class="flex flex-row items-center">
    <span v-if="showIcon" class="pi pi-bullseye mr-5 text-3xl"></span>
    <p class="text-3xl font-bold text-copy">{{ app_title }}</p>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const app_title = runtimeConfig.public.APP_TITLE;

defineProps({
  showIcon: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped></style>
