<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <Button
        icon="pi pi-chevron-left"
        class="p-button-text p-button-rounded"
        @click="$router.go(-1)"
      />
      <h1 class="text-3xl ml-4 text-copy">Settings</h1>
    </div>
    <Card class="mb-8">
      <template #title>Personal Information</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium">Name</label>
            <InputText
              id="name"
              v-model="user.user_metadata.full_name"
              readonly
              class="mt-1 w-full"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium">Email</label>
            <InputText
              id="email"
              v-model="user.email"
              readonly
              class="mt-1 w-full"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-8">
      <template #title>App Theme</template>
      <template #content>
        <Select
          v-model="theme"
          :options="themeOptions"
          optionLabel="name"
          class="w-full"
          placeholder="Select a theme"
          @change="handleThemeChange"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <span :class="slotProps.value.icon" class="mr-2" />
              {{ slotProps.value.name }}
            </div>
            <div v-else>
              {{ slotProps.placeholder }}
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <span :class="slotProps.option.icon" class="mr-2" />
              {{ slotProps.option.name }}
            </div>
          </template>
        </Select>
      </template>
    </Card>
    <Card class="mb-8">
      <template #title>Purchase History</template>
      <template #content>
        <Accordion value="0" class="text-copy">
          <AccordionPanel
            v-for="(purchase, index) in purchases"
            :key="index"
            :value="index"
          >
            <AccordionHeader>
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-4">
                  <i class="pi pi-credit-card"></i>
                  <div>
                    <h3 class="font-semibold">
                      {{ capitalizeFirstLetter(purchase.type) }}
                    </h3>
                    <!-- <p class="text-sm text-gray-500">{{ purchase.date }}</p> -->
                  </div>
                </div>
                <span class="font-semibold text-sm mr-2">{{
                  formatRelativeTime(purchase.created_at)
                }}</span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="p-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-semibold text-sm text-primary">
                      Order Details
                    </h4>
                    <p>
                      <span class="font-medium">Order ID:</span>
                      {{ purchase.data.id }}-{{ purchase.id }}
                      <Button
                        icon="pi pi-copy"
                        class="ml-2 text-xs"
                        size="small"
                        text
                        @click="
                          copyToClipboard(purchase.data.id + '-' + purchase.id)
                        "
                      />
                    </p>
                    <p>
                      <span class="font-medium">Created on:</span>
                      {{ formatDate(purchase.created_at) }}
                    </p>
                    <p></p>
                    <p>
                      <span class="font-medium">Status:</span>
                      {{ capitalizeFirstLetter(purchase.data.status) }}
                    </p>
                    <p>
                      <span class="font-medium">Amount Paid:</span>
                      {{ purchase.data.currency }}
                      {{ (purchase.data.amount_paid / 100).toFixed(2) }}
                    </p>

                    <p>
                      <span class="font-medium">Payment Provider:</span>
                      {{ capitalizeFirstLetter(purchase.provider) }}
                    </p>
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm text-primary">
                      Subscription Info
                    </h4>
                    <p>
                      <span class="font-medium">Duration:</span>
                      {{ purchase.data.notes.duration }} months
                    </p>
                    <p>
                      <span class="font-medium">Expires:</span>
                      {{ formatDate(purchase.data.notes.expires_at) }}
                    </p>
                  </div>
                </div>

                <div v-if="purchase.refund">
                  <h4 class="font-semibold text-sm text-primary">
                    Refund Information
                  </h4>
                  <p>{{ purchase.refund }}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </template>
    </Card>
  </div>
</template>

<script setup>
// Icons (you may need to import these from your icon library)
import { formatDistanceToNow, parseISO } from "date-fns";
const colorMode = useColorMode();

const userStore = useUserStore();
await userStore.getUserData();

const user = userStore.user;

const toast = useToast();

const themeOptions = [
  { name: "Light", value: "light", icon: "pi pi-sun" },
  { name: "Dark", value: "dark", icon: "pi pi-moon" },
  { name: "System", value: "system", icon: "pi pi-desktop" },
];
const theme = ref({});

const purchases = ref([]);

onMounted(async () => {
  purchases.value = await userStore.user.userData.plans;
  //sort purchases by date
  purchases.value.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  theme.value = themeOptions.filter(
    (option) => option.value == colorMode.preference
  )[0];
});
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const formatRelativeTime = (dateString) => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);

  toast.add({
    severity: "success",
    summary: "Copied to clipboard",
    detail: text,
    life: 3000,
  });
};

// You can add methods here to handle theme changes, etc.
const handleThemeChange = (newTheme) => {
  colorMode.preference = newTheme.value.value;
  // Implement theme change logic here
  console.log("Theme changed to:", newTheme.value.value);
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
