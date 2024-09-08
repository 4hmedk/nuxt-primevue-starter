<template>
  <ToggleButton
    v-model="darkMode"
    onLabel=" "
    offLabel=" "
    onIcon="pi pi-moon"
    offIcon="pi pi-sun"
    class="rounded-full border-none"
  />
</template>

<script setup>
const colorMode = useColorMode();
const darkMode = ref(false);

onMounted(() => {
  console.log(colorMode.preference);
  if (colorMode.preference != "system") {
    console.log("not system");
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
