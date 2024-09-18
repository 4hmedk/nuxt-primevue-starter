<template>
  <Button
    @click="darkMode = !darkMode"
    :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
    aria-label="Dark mode toggle"
    severity="secondary"
    text
    rounded
  />
</template>

<script setup>
const colorMode = useColorMode();
const darkMode = ref(false);

onMounted(() => {
  if (colorMode.preference != "system") {
    darkMode.value = colorMode.preference === "dark";
  }
});

watch(
  () => darkMode.value,
  (newValue, oldValue) => {
    colorMode.preference = newValue ? "dark" : "light";
  }
);
</script>

<style scoped></style>
