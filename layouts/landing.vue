<template>
  <div>
    <!-- app menu -->
    <Drawer v-model:visible="drawerVisible">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full bg-background">
          <div class="flex items-center justify-between px-6 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <LogoComponent />
            </span>
            <span>
              <Button
                type="button"
                @click="closeCallback"
                icon="pi pi-times"
                rounded
                outlined
                class="*:text-copy !border-border"
              ></Button>
            </span>
          </div>
          <div class="overflow-y-auto my-auto">
            <Menu :model="navItems" pt:root:class="bg-transparent">
              <template #item="{ item, props }">
                <router-link
                  v-if="item.route"
                  :to="item.route"
                  active-class="text-primary"
                >
                  <!-- <span :class="item.icon" /> -->
                  <span class="ml-5 text-lg">{{ item.label }}</span>
                </router-link>
              </template>
            </Menu>
          </div>
          <div class="mt-auto p-4">
            <NuxtLink to="/app/home">
              <Button label="Go to app" class="m-2 *:text-cta" />
            </NuxtLink>
          </div>
        </div>
      </template>
    </Drawer>

    <!-- header -->
    <header
      class="w-screen sticky top-0 bg-background/70 backdrop-blur-md border-b-[0.5px] border-border z-10"
    >
      <Toolbar
        class="border-none max-w-screen-lg mx-auto text-copy !bg-transparent"
      >
        <template #start>
          <Button
            icon="pi pi-bars"
            @click="drawerVisible = true"
            class="block md:hidden mr-2 *:text-copy !border-border"
            outlined
          />

          <nuxt-link to="/">
            <LogoComponent />
          </nuxt-link>
        </template>
        <template #center>
          <div class="flex-row hidden md:flex">
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
            <div class="card flex justify-center">
              <DarkmodeToggle />
            </div>
          </div>
          <NuxtLink to="/app/home">
            <Button label="Go to app" class="*:text-cta" />
          </NuxtLink>
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

const drawerVisible = ref(false);

const navItems = [
  {
    label: "Home",
    route: "/",
  },
  // {
  //   label: "Pricing",
  //   route: "/pricing",
  // },
  {
    label: "Contact",
    route: "/contact",
  },
];
</script>

<style scoped></style>
