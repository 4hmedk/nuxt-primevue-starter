<template>
  <div class="flex flex-col space-y-4">
    <div
      v-for="feature in features"
      :key="feature"
      class="flex items-center space-x-2"
    >
      <i class="pi pi-check text-green-500"></i>
      <span>{{ feature }}</span>
    </div>

    <Dropdown
      v-model="selectedPlan"
      :options="plans"
      optionLabel="name"
      placeholder="Select a plan"
      class="w-full md:w-14rem"
    />

    <Button
      label="Subscribe"
      icon="pi pi-check"
      @click="handleSubscribe"
      :disabled="!selectedPlan"
    />
  </div>
</template>

<script setup>
const userStore = useUserStore();
const runtimeConfig = useRuntimeConfig();

const features = [
  "Access to premium content",
  "Ad-free experience",
  "Priority support",
  "Exclusive webinars",
];

const plans = [
  { name: "Monthly", price: 999, interval: "month" },
  { name: "Yearly", price: 9999, interval: "year" },
];

const selectedPlan = ref(null);

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handleSubscribe = async () => {
  if (!selectedPlan.value) return;

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    console.error("Failed to load Razorpay SDK");
    isLoading.value = false;
    return;
  }

  const options = {
    key: runtimeConfig.public.RAZORPAY_TEST_KEY_ID, // Replace with your actual Razorpay key
    amount: selectedPlan.value.price,
    currency: "INR",
    name: "Your Company Name",
    description: `${selectedPlan.value.name} Premium Plan`,
    handler: function (response) {
      // Handle successful payment
      console.log(response);
      userStore.upgradeToPremium(selectedPlan.value);
    },
    prefill: {
      email: userStore.user.email,
      contact: userStore.user.phone,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
</script>

<style lang="scss" scoped></style>
