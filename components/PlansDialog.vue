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

    <div class="flex flex-row justify-between">
      <p>Total:</p>
      <p class="text-end">12x9999</p>
    </div>
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
const toast = useToast();

const features = [
  "Access to premium content",
  "Ad-free experience",
  "Priority support",
  "Exclusive webinars",
];

const plans = [
  { name: "Monthly", price: 99900, interval: "month" },
  { name: "Yearly", price: 999900, interval: "year" },
];

const selectedPlan = ref(plans[1]);

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

  const sb_order = await $fetch("/api/razorpay/createOrder", {
    method: "POST",
    body: {
      user_id: userStore.user.id,
      duration: selectedPlan.value.interval === "month" ? 1 : 12,
      jwt: useSupabaseSession().value.access_token,
    },
  });
  const order = sb_order.order;

  if (!order) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create order",
      life: 3000,
    });
    console.error("Failed to create order");
    return;
  }

  const options = {
    key: runtimeConfig.public.RAZORPAY_TEST_KEY_ID, // Replace with your actual Razorpay key
    amount: order.data.amount,
    order_id: order.data.id,
    name: runtimeConfig.public.APP_TITLE,
    description: "Annual Plan",
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
  //add failure handler
  rzp.on("payment.failed", function (response) {
    console.log(response);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Payment Failed",
      life: 3000,
    });
  });
  rzp.open();
};
</script>

<style lang="scss" scoped></style>
