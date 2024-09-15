<template>
  <div class="p-4">
    <!-- <component :is="SignupNameSlide" /> -->
    <Card
      class="mx-auto w-full max-w-screen-sm md:mt-20 border border-border rounded-lg shadow-md"
    >
      <template #content>
        <div class="relative overflow-hidden w-full">
          <div
            class="flex transition-transform duration-300 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(slide, index) in slides"
              :key="index"
              class="w-full p-4 flex-shrink-0"
            >
              <component
                :is="slide.component"
                @next="nextSlide"
                @prev="prevSlide"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { SignupNameSlide, SignupNamePhone } from "#components";
const toast = useToast();
const slides = ref([
  { component: SignupNameSlide },
  { component: SignupNamePhone },
]);

const currentSlide = ref(0);

//get user signup progress
const userStore = useUserStore();
const user = await userStore.getUserData();
const current_progress = user.userData.signup_progress;

currentSlide.value =
  current_progress < slides.value.length ? current_progress : 0;

const nextSlide = async (values) => {
  console.log("next");
  const success = await userStore.updateUserData({
    newtags: values,
    newSignupProgress: currentSlide.value + 1,
  });

  if (!success) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        "Details could not be updated, please check your connection and try again",
      life: 5000,
    });
  }

  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value++;
  } else {
    navigateTo("/app/home");
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

definePageMeta({
  layout: "minimal",
});
</script>
