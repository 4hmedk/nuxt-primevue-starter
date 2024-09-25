<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Contact Us</h1>

    <form @submit.prevent="submitForm" class="max-w-lg mx-auto">
      <div class="mb-4">
        <label
          for="requestType"
          class="block text-sm font-medium text-copy mb-1"
        >
          Type of Request
        </label>
        <Dropdown
          v-model="formData.requestType"
          :options="requestTypes"
          optionLabel="name"
          optionValue="value"
          placeholder="Select a request type"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label for="subject" class="block text-sm font-medium text-copy mb-1">
          Subject
        </label>
        <InputText
          id="subject"
          v-model="formData.subject"
          type="text"
          class="w-full"
          placeholder="Enter the subject of your query"
          maxlength="100"
        />
      </div>

      <div class="mb-4">
        <label for="message" class="block text-sm font-medium text-copy mb-1">
          Your Message
        </label>
        <Textarea
          id="message"
          v-model="formData.message"
          rows="5"
          class="w-full"
          placeholder="Type your message here"
          maxlength="1000"
        />
      </div>
      <div class="mt-6 text-copy-secondary text-sm">
        This form will open into your default email app. You may add more
        information and attachments if needed. Please do not edit the subject
        line and details added to the body.
      </div>

      <div class="mt-6">
        <Button type="submit" label="Send Message" class="w-full" />
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

const requestTypes = [
  { name: "General Inquiry", value: "general" },
  { name: "Technical Support", value: "support" },
  { name: "Billing Question", value: "billing" },
  { name: "Feature Request", value: "feature" },
  { name: "Other", value: "other" },
];

const formData = ref({
  requestType: "",
  subject: "",
  message: "",
});

const emailSubject = computed(() => {
  const type =
    requestTypes.find((t) => t.value === formData.value.requestType)?.name ||
    "Contact Form";
  return `${useRuntimeConfig().public.APP_TITLE} ${type}: ${
    formData.value.subject
  }`;
});

let suffix = "";
const userStore = useUserStore();
await userStore.getUserData();
if (userStore.isAuthenticated) {
  suffix = `
Details:
${userStore.user.user_metadata?.full_name}
account id: ${userStore.user.id}`;
}

const emailBody = computed(() => {
  return `
  ${formData.value.message}

  ${suffix}
  `;
});

// Email obfuscation
const obfuscatedEmail = "contact[at]bookvizz[dot]com";
const deobfuscateEmail = (email) => {
  return email.replace("[at]", "@").replace("[dot]", ".");
};

const submitForm = () => {
  const mailtoLink = `mailto:${deobfuscateEmail(
    obfuscatedEmail
  )}?subject=${encodeURIComponent(
    emailSubject.value
  )}&body=${encodeURIComponent(emailBody.value)}`;
  window.location.href = mailtoLink;
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
