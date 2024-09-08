<template>
  <div>
    <!-- header -->
    <HeaderComponent />
    <slot />

    <!-- footer -->
    <footer class="bg-background text-copy-secondary">
      <div
        class="container mx-auto px-4 my-[100px] flex flex-col md:flex-row justify-between items-center"
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
</script>

<style scoped></style>
