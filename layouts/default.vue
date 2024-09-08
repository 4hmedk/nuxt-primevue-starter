<template>
  <Toolbar class="border-none container mx-auto text-copy">
    <template #start>
      <LogoComponent />

      <div class="ml-2">
        <NuxtLink
          v-for="tab in items"
          :key="tab.label"
          :to="tab.route"
          active-class="text-primary"
        >
          <Button :label="tab.label" text plain class="text-cta" />
        </NuxtLink>
      </div>
    </template>

    <template #end>
      <Button label="Go to app" />
    </template>
  </Toolbar>
  <slot></slot>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import Toolbar from "primevue/toolbar";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Avatar from "primevue/avatar";

const items = ref([
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Pricing",
    route: "/about",
  },
  {
    label: "Contact",
    route: "/contact",
  },
]);
</script>

<style scoped></style>
