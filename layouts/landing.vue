<template>
  <div>
    <!-- header -->
    <header class="w-screen sticky top-0">
      <Toolbar
        class="border-none max-w-screen-lg mx-auto text-copy !bg-background"
      >
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
    </header>
    <slot />

    <!-- footer -->
    <footer class="bg-background text-copy-secondary">
      <div
        class="max-w-screen-lg mx-auto px-4 my-[100px] flex flex-col md:flex-row justify-between items-center"
      >
        <!-- App Name -->
        <div class="text-lg font-semibold">
          <span class="text-white"><LogoComponent /> </span>
        </div>

        <!-- Footer Links -->
        <nav class="mt-4 md:mt-0 space-x-4">
          <Button label="Contact Us" text plain class="text-copy-secondary" />
          <Button label="Pricing" text plain class="text-copy-secondary" />
          <Button label="Terms of Use" text plain class="text-copy-secondary" />
          <Button
            label="Refund Policy"
            text
            plain
            class="text-copy-secondary"
          />
          <Button
            label="Privacy Policy"
            text
            plain
            class="text-copy-secondary"
          />
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Button from "primevue/button";

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

<style scoped></style>
