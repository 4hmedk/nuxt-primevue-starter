<template>
  <!-- header -->
  <Toolbar class="border-none max-w-screen-lg mx-auto text-copy !bg-background">
    <template #start>
      <nuxt-link to="/">
        <LogoComponent />
      </nuxt-link>
    </template>
    <template #center>
      <div class="flex flex-row">
        <NuxtLink
          v-for="tab in navItems"
          :key="tab.label"
          :to="tab.route"
          active-class="text-primary"
        >
          <Button :label="tab.label" text plain class="!text-inherit" />
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
      <NuxtLink to="/app/home"
        ><Button label="Go to app" class="*:text-cta"
      /></NuxtLink>
    </template>
  </Toolbar>
</template>

<script setup>
const navItems = [
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
];
</script>
