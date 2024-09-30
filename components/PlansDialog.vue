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

    <Select
      v-model="selectedProvider"
      :options="['razorpay', 'lemonsqueezy']"
      class="w-full md:w-14rem"
    />

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
      @click="handlePaymentInit"
      :loading="isLoading"
      :disabled="!selectedPlan"
    />
  </div>
</template>

<script setup>
const userStore = useUserStore();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const isLoading = ref(false);

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
const selectedProvider = ref("lemonsqueezy");

const loadpaymentScript = (provider) => {
  if (provider === "razorpay") {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  } else {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://app.lemonsqueezy.com/js/lemon.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
};

async function verifyPayment(authenticationResponse, sb_order_id) {
  console.log(authenticationResponse);
  try {
    const verifyOrderResponse = await $fetch("/api/razorpay/verifyOrder", {
      method: "POST",
      body: {
        sb_order_id: sb_order_id,
        rp_order_id: authenticationResponse.razorpay_order_id,
        jwt: useSupabaseSession().value.access_token,
      },
    });
    console.log(verifyOrderResponse);
    const order = verifyOrderResponse.order;
    //update local store
    useUserStore().user.userData.plans.push(order);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Payment details verified successfully",
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Payment details could not be verified, Please contact support",
    });
    console.log(error);
  }
}

const handlePaymentInit = async () => {
  if (!selectedPlan.value) return;
  isLoading.value = true;

  if (selectedProvider.value === "razorpay") {
    await handleRazorpayPayment();
    return;
  } else {
    await handleLemonSqueezyPayment();
  }
  isLoading.value = false;
};

const handleRazorpayPayment = async () => {
  const isScriptLoaded = await loadpaymentScript("razorpay");
  if (!isScriptLoaded) {
    console.error("Failed to load Razorpay SDK");
    isLoading.value = false;
    return;
  }

  const createOrderResponse = await $fetch("/api/razorpay/createOrder", {
    method: "POST",
    body: {
      user_id: userStore.user.id,
      duration: selectedPlan.value.interval === "month" ? 1 : 12,
      jwt: useSupabaseSession().value.access_token,
    },
  });
  const order = createOrderResponse.order;
  console.log(order);

  if (!order) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create order",
      life: 3000,
    });
    console.error("Failed to create order");
    isLoading.value = false;
    return;
  }

  const options = {
    key:
      process.env.NODE_ENV === "development"
        ? runtimeConfig.public.RAZORPAY_TEST_KEY_ID
        : runtimeConfig.public.RAZORPAY_KEY_ID, // Replace with your actual Razorpay key
    amount: order.data.amount,
    order_id: order.data.id,
    name: runtimeConfig.public.APP_TITLE,
    description: "Annual Plan",
    description: `${selectedPlan.value.name} Premium Plan`,
    handler: async function (authenticationResponse) {
      // Handle successful payment
      console.log(authenticationResponse);
      await verifyPayment(authenticationResponse, order.id);
      isLoading.value = false;
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
    isLoading.value = false;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Payment Failed",
      life: 3000,
    });
  });
  rzp.open();
};

const handleLemonSqueezyPayment = async () => {
  const isScriptLoaded = await loadpaymentScript("lemonsqueezy");
  if (!isScriptLoaded) {
    console.error("Failed to load lemonsqueezy SDK");
    isLoading.value = false;
    return;
  }

  const createOrderResponse = await $fetch("/api/lemonsqueezy/createCheckout", {
    method: "POST",
    body: {
      user_id: userStore.user.id,
      email: userStore.user.email,
      jwt: useSupabaseSession().value.access_token,
      full_name: userStore.user.user_metadata.full_name,
    },
  });
  console.log(createOrderResponse);

  if (!createOrderResponse.order) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create order",
      life: 3000,
    });
    console.error("Failed to create order");
    isLoading.value = false;
    return;
  }

  const checkoutUrl = createOrderResponse["order"]["data"]["attributes"]["url"];
  console.log(checkoutUrl);
  window.createLemonSqueezy();
  LemonSqueezy.Url.Open(checkoutUrl);
};
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
