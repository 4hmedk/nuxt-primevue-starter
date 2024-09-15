<template>
  <!-- hero section -->
  <div class="" v-for="i in 3" :key="i">
    <div
      class="container max-w-screen-lg mx-auto grid grid-cols-12 surface-section text-800"
    >
      <div
        class="col-span-12 md:col-span-6 p-6 text-center md:text-left flex align-items-center"
      >
        <section>
          <span class="block text-6xl font-bold mb-1 text-copy"
            >Create the screens your</span
          >
          <div class="text-6xl text-primary font-bold mb-3">
            visitors deserve to see
          </div>
          <p class="mt-0 mb-4 text-700 line-height-3 text-copy-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Button
            label="Learn More"
            type="button"
            class="mr-3 p-button-raised"
          ></Button>
          <Button
            label="Live Demo"
            type="button"
            class="p-button-outlined"
            severity="secondary"
          ></Button>
        </section>
      </div>
      <div class="col-span-12 md:col-span-6 overflow-hidden">
        <img
          src="https://blocks.primevue.org/images/blocks/hero/hero-1.png"
          alt="Image"
          class="md:ml-auto block md:h-full"
          style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// use ladinglayout template
import { ref } from "vue";
import Button from "primevue/button";

definePageMeta({
  layout: "landing",
});
</script>

<style scoped></style>
