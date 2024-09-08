<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <div class="text-2xl font-bold text-blue-600">AppDash</div>
        <div class="flex items-center space-x-4">
          <InputText placeholder="Search..." class="p-inputtext-sm" />
          <Button icon="pi pi-bell" class="p-button-rounded p-button-text" />
          <Avatar icon="pi pi-user" shape="circle" />
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-md h-screen">
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <Button
                icon="pi pi-home"
                label="Dashboard"
                class="p-button-text w-full justify-start"
              />
            </li>
            <li>
              <Button
                icon="pi pi-chart-line"
                label="Analytics"
                class="p-button-text w-full justify-start"
              />
            </li>
            <li>
              <Button
                icon="pi pi-users"
                label="Users"
                class="p-button-text w-full justify-start"
              />
            </li>
            <li>
              <Button
                icon="pi pi-cog"
                label="Settings"
                class="p-button-text w-full justify-start"
              />
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <h1 class="text-3xl font-semibold mb-6">Dashboard Overview</h1>

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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Card from "primevue/card";

// Sample data for charts
const userGrowthData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Users",
      data: [540, 625, 700, 810, 980, 1200],
      fill: false,
      borderColor: "#4CAF50",
    },
  ],
});

const revenueData = ref({
  labels: ["Product A", "Product B", "Product C", "Product D"],
  datasets: [
    {
      data: [300, 150, 100, 75],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>
