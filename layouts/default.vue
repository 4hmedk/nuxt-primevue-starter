<template>
  <!-- header -->
  <Toolbar class="border-none container mx-auto text-copy">
    <template #start>
      <LogoComponent />
    </template>
    <template #end>
      <DarkmodeToggle />
      <NuxtLink to="/app/profile">
        <Button icon="pi pi-user" class="bg-transparent border-none" />
      </NuxtLink>
    </template>
  </Toolbar>
  <slot></slot>
</template>

<script setup></script>

<style scoped></style>
