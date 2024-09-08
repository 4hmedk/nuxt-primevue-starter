<template>
  <div class="min-h-screen bg-background">
    <div class="flex">
      <!-- Main Content -->
      <main class="flex-1 p-8 text-copy">
        <h1 class="text-3xl font-semibold mb-6">Dashboard Overview</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card class="shadow-md !bg-card">
            <template #title>Total Users</template>
            <template #content>
              <div class="text-4xl font-bold">1,234</div>
              <div class="text-green-500">+5.2% from last week</div>
            </template>
          </Card>
          <Card class="shadow-md !bg-card">
            <template #title>Revenue</template>
            <template #content>
              <div class="text-4xl font-bold">$45,678</div>
              <div class="text-red-500">-2.1% from last month</div>
            </template>
          </Card>
          <Card class="shadow-md !bg-card">
            <template #title>Active Projects</template>
            <template #content>
              <div class="text-4xl font-bold">23</div>
              <div class="text-gray-500">2 completed this week</div>
            </template>
          </Card>
          <Card class="shadow-md !bg-card">
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

<script setup></script>
