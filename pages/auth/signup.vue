<template>
  <div class="container max-w-screen-lg mx-auto p-4">
    <!-- <component :is="SignupNameSlide" /> -->
    <Carousel
      :value="slides"
      :numVisible="1"
      :numScroll="1"
      :circular="false"
      :showNavigators="false"
      :showIndicators="false"
      @page-change="onPageChange"
    >
      <template #item="slotProps">
        <Card
          class="mx-auto w-full max-w-screen-sm border border-border p-4 rounded-lg shadow-md"
        >
          <template #content>
            <component
              :is="slotProps.data.component"
              @next="nextSlide"
              @prev="prevSlide"
            />
          </template>
        </Card>
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { SignupNameSlide } from "#components";
const slides = ref([{ component: SignupNameSlide }]);

const currentSlide = ref(0);

const nextSlide = () => {
  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const onPageChange = (event) => {
  currentSlide.value = event.page;
};
</script>
