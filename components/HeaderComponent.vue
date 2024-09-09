<template>
  <!-- header -->
  <Toolbar class="border-none container mx-auto text-copy !bg-background">
    <template #start>
      <nuxt-link to="/">
        <LogoComponent />
      </nuxt-link>
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
      <div class="card mr-2 flex justify-center">
        <template>
          <div class="card flex justify-center">
            <DarkmodeToggle />
          </div>
        </template>
      </div>
      <NuxtLink to="/app/home"><Button label="Go to app" /></NuxtLink>
    </template>
  </Toolbar>
</template>

<script setup>
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
