<template>
  <!-- header -->
  <Toolbar class="border-none container mx-auto !bg-transparent">
    <template #start>
      <nuxt-link to="/">
        <LogoComponent />
      </nuxt-link>
    </template>
    <template #end>
      <DarkmodeToggle />
      <!-- <NuxtLink to="/app/profile"></NuxtLink> -->
      <Button
        icon="pi pi-user"
        class="!bg-transparent border-none"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        severity="secondary"
      />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
        <template #start>
          <div
            class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 text-copy"
          >
            <Avatar
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              class="mr-2"
              shape="circle"
            />
            <span class="inline-flex flex-col items-start">
              <span class="font-bold">Amy Elsner</span>
              <span class="text-sm">Free Plan</span>
            </span>
          </div>
        </template>
      </Menu>
    </template>
  </Toolbar>
  <slot></slot>
</template>

<script setup>
const menu = ref();
const items = ref([
  {
    items: [
      {
        label: "Settings",
        icon: "pi pi-cog",
        command: () => {
          navigateTo("/app/profile");
        },
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: async () => {
          //signout
          const { handleLogout } = useSupabase();
          await handleLogout();
        },
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped></style>
