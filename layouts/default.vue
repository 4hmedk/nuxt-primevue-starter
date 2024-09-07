<template>
  <div class="card">
    <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
        <Tabs value="home">
          <TabList>
            <NuxtLink v-for="tab in items" :key="tab.label" :to="tab.route">
              <Tab v-if="tab.route" :value="tab.route">
                <div class="h-full w-full flex items-center gap-2 text-inherit">
                  <i :class="tab.icon" />
                  <span>{{ tab.label }}</span>
                </div>
              </Tab>
            </NuxtLink>
          </TabList>
        </Tabs>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Button label="Share" severity="contrast" size="small" />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            style="width: 32px; height: 32px"
          />
        </div>
      </template>
    </Toolbar>
    <slot></slot>
  </div>
  <RouterView />
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
    icon: "pi pi-home",
    route: "home",
  },
  {
    label: "About",
    icon: "pi pi-info-circle",
    route: "about",
  },
  {
    label: "Contact",
    icon: "pi pi-envelope",
    route: "contact",
  },
]);
</script>

<style scoped></style>
