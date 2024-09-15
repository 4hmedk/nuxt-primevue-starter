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
    </template>
  </Toolbar>
  <slot></slot>
  <Toast />
</template>

<script setup></script>

<style scoped></style>
