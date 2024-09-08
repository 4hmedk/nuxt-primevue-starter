<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <!-- Account Details Section -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Account Details</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Username</label
          >
          <InputText
            id="username"
            v-model="username"
            class="mt-1 block w-full border-gray-300"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <InputText
            id="email"
            v-model="email"
            class="mt-1 block w-full border-gray-300"
          />
        </div>
      </div>
      <Button label="Update Account" class="mt-4 p-button-primary" />
    </div>

    <!-- Subscription Details Section -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Subscription Details</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="plan" class="block text-sm font-medium text-gray-700"
            >Subscription Plan</label
          >
          <InputText
            id="plan"
            v-model="subscriptionPlan"
            class="mt-1 block w-full border-gray-300"
            disabled
          />
        </div>
        <div>
          <label for="renewal" class="block text-sm font-medium text-gray-700"
            >Next Renewal Date</label
          >
          <InputText
            id="renewal"
            v-model="renewalDate"
            class="mt-1 block w-full border-gray-300"
            disabled
          />
        </div>
      </div>
      <Button label="Manage Subscription" class="mt-4 p-button-secondary" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import  InputText from "primevue/inputtext";
import Button from "primevue/button";

const username = ref("DrAhmed");
const email = ref("ahmed@example.com");
const subscriptionPlan = ref("Premium");
const renewalDate = ref("2024-12-01");
</script>

<style scoped>
/* Additional styling if necessary */
</style>
