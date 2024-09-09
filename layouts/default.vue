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
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </template>
  </Toolbar>
  <slot></slot>
</template>

<script setup>
const menu = ref();
const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Refresh",
        icon: "pi pi-refresh",
      },
      {
        label: "Export",
        icon: "pi pi-upload",
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped></style>
