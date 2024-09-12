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
              :image="data.user_metadata.avatar_url"
              class="mr-2"
              shape="circle"
            />
            <span class="inline-flex flex-col items-start">
              <span class="font-bold">{{ data.user_metadata.full_name }}</span>
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
const data = reactive({
  user_metadata: null,
});
const userStore = useUserStore();
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
          await userStore.handleLogout();
          navigateTo("/auth/login");
        },
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

data.user_metadata = userStore.user?.user_metadata;
</script>

<style scoped></style>
