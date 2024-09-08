<template>
  <!-- header -->
  <Toolbar class="border-none container mx-auto text-copy">
    <template #start>
      <LogoComponent />
      <div class="ml-2">
        <NuxtLink
          v-for="tab in items"
          :key="tab.label"
          :to="tab.route"
          active-class="text-primary"
        >
          <Button :label="tab.label" text plain class="text-cta" />
        </NuxtLink>
      </div>
    </template>
    <template #end>
      <div class="card mr-3 flex justify-center">
        <ToggleSwitch v-model="darkMode" />
      </div>
      <NuxtLink to="/auth/login"><Button label="Go to app" /></NuxtLink>
    </template>
  </Toolbar>
</template>

<script setup>
import ToggleSwitch from "primevue/toggleswitch";
import { ref, watch } from "vue";
import Toolbar from "primevue/toolbar";

const colorMode = useColorMode();
const darkMode = ref(false);

onMounted(() => {
  console.log(colorMode.preference);
  if (colorMode.preference != "system") {
    // darkMode.value = colorMode.preference === "dark";
  }
});

watch(
  () => darkMode.value,
  (newValue, oldValue) => {
    colorMode.preference = newValue ? "dark" : "light";
  }
);

const items = ref([
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Pricing",
    route: "/about",
  },
  {
    label: "Contact",
    route: "/contact",
  },
]);
</script>

<style>
.p-toggleswitch-slider,
.p-toggleswitch-input {
  @apply bg-red-50;
}
</style>
