<template>
  <div class="min-h-screen">
    <div class="container mx-auto">
      <!-- Main Content -->
      <main class="flex-1 p-8">
        <h1 class="text-3xl font-semibold mb-6 text-copy">
          Dashboard Overview
        </h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card class="shadow-md">
            <template #title>Total Users</template>
            <template #content>
              <div class="text-4xl font-bold">1,234</div>
              <div class="text-green-500">+5.2% from last week</div>
            </template>
          </Card>
          <Card class="shadow-md">
            <template #title>Revenue</template>
            <template #content>
              <div class="text-4xl font-bold">$45,678</div>
              <div class="text-red-500">-2.1% from last month</div>
            </template>
          </Card>
          <Card class="shadow-md">
            <template #title>Active Projects</template>
            <template #content>
              <div class="text-4xl font-bold">23</div>
              <div class="text-gray-500">2 completed this week</div>
            </template>
          </Card>
          <Card class="shadow-md">
            <template #title>Tasks Completed</template>
            <template #content>
              <div class="text-4xl font-bold">89%</div>
              <div class="text-blue-500">+12% from last month</div>
            </template>
          </Card>
          <Button
            label="Premium Feature"
            icon="pi pi-bookmark"
            @click="handlePremiumFeature"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { PlansDialog } from "#components";

const userStore = useUserStore();

const dialog = useDialog();

async function handlePremiumFeature() {
  //get user plan
  await userStore.getUserData();

  dialog.open(PlansDialog, {
    props: {
      header: "Select a plan",
      style: {
        width: "50vw",
      },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
      modal: true,
    },
  });
}
</script>
