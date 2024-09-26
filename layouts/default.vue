<template>
  <div class="flex h-screen">
    <!-- Desktop Sidebar -->
    <aside
      :class="[
        { 'w-64': isExpanded, 'w-[70px]': !isExpanded },
        'bg-primary-500 text-copy transition-all duration-300 ease-in-out h-screen overflow-hidden hidden md:block',
      ]"
    >
      <div class="flex flex-col h-full w-64 p-4">
        <!-- Logo section -->
        <div class="flex items-start mb-6">
          <div class="ml-1">
            <nuxt-link to="/">
              <LogoComponent :show-icon="true" />
            </nuxt-link>
          </div>
        </div>

        <!-- Navigation links -->
        <div class="flex-grow">
          <NuxtLink
            v-for="(routerTab, index) in routerTabs"
            :key="index"
            :to="routerTab.route"
            class="flex items-center mb-4 text-copy"
          >
            <Button :icon="routerTab.icon" class="text-copy" />
            <span class="ml-4 text-sm">{{ routerTab.label }}</span>
            <!-- <Tooltip
              v-if="!isExpanded"
              :value="routerTab.label"
              position="right"
            /> -->
          </NuxtLink>
        </div>
      </div>
    </aside>
    <!-- header and main -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- header -->
      <Toolbar
        class="border-none w-full mx-auto hidden md:block !bg-transparent"
      >
        <template #start>
          <!-- Expand button -->
          <Button
            :class="[
              'text-white',
              'flex items-center justify-center',
              'w-12 h-12', // Adjust size as needed
            ]"
            @click="toggleMenu"
            aria-label="Toggle Menu"
            text
          >
            <div class="relative w-6 h-8">
              <div
                :class="[
                  'absolute top-1/2 left-0 w-6 h-[2px] bg-current transform transition-all duration-300 rounded-full',
                  isExpanded ? 'rotate-45' : '-translate-y-1.5',
                ]"
              />
              <div
                :class="[
                  'absolute top-1/2 left-0 w-6 h-[1.5px] bg-current transform transition-all duration-300 rounded-full',
                  isExpanded ? 'opacity-0' : 'opacity-100',
                ]"
              />
              <div
                :class="[
                  'absolute top-1/2 left-0 w-6 h-[2px] bg-current transform transition-all duration-300 rounded-full',
                  isExpanded ? '-rotate-45' : 'translate-y-1.5',
                ]"
              />
            </div>
          </Button>
        </template>
        <template #end>
          <DarkmodeToggle />
          <!-- <NuxtLink to="/app/profile"></NuxtLink> -->
          <Button
            icon="pi pi-user"
            class="!bg-transparent border-none"
            @click="openUserMenu"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            severity="secondary"
          />
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
            <template #start>
              <div
                class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 text-copy"
              >
                <Avatar
                  :image="data.user_metadata.avatar_url"
                  class="mr-2"
                  shape="circle"
                />
                <span class="inline-flex flex-col items-start">
                  <span class="font-bold">{{
                    data.user_metadata.full_name
                  }}</span>
                  <span class="text-sm">Free Plan</span>
                </span>
              </div>
            </template>
          </Menu>
        </template>
      </Toolbar>
      <!-- page container -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <slot></slot>
      </div>
      <!-- Mobile bottom navigation -->
      <Toolbar
        class="border-none w-full mx-auto block md:hidden !bg-transparent"
      >
        <template #center>
          <div class="flex flex-row text-copy gap-8">
            <NuxtLink
              v-for="tab in routerTabs"
              :key="tab.label"
              :to="tab.route"
              active-class="text-primary"
            >
              <Button
                :icon="tab.icon"
                text
                rounded
                class="!text-inherit focus:!outline-none"
                :pt="{ root: ['focus:outline-none'] }"
                :ptOptions="{ mergeProps: true }"
              />
            </NuxtLink>
            <Button
              icon="pi pi-user"
              class="!bg-transparent border-none"
              @click="openUserMenu"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              severity="secondary"
            />
          </div>
        </template>
        <template #end> </template>
      </Toolbar>
    </main>
    <DynamicDialog />
  </div>
</template>
<script setup>
const data = reactive({
  user_metadata: null,
  rand: Date.now(),
  profile: {
    avatarURL: "https://example.com/default-avatar.png",
    name: {
      title: "",
      firstname: "",
      lastname: "",
    },
  },
});
const userStore = useUserStore();
const menu = ref();
const items = ref([
  {
    items: [
      {
        label: "Settings",
        icon: "pi pi-cog",
        command: () => {
          navigateTo("/app/profile");
        },
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",

        command: async () => {
          //signout
          await userStore.handleLogout();
          navigateTo("/auth/login");
        },
      },
    ],
  },
]);

const openUserMenu = (event) => {
  menu.value.toggle(event);
};

const isExpanded = ref(localStorage.getItem("is_expanded") === "true");

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value;
  localStorage.setItem("is_expanded", isExpanded.value);
};

const onSettingsClick = (tab) => {
  // Implement settings dialog logic here
  console.log(`Opening settings dialog for ${tab}`);
};

const openLinkDialog = () => {
  // Implement link dialog logic here
  console.log("Opening link dialog");
};

const onLogoutClick = async () => {
  //sign out and redirect to home
  await userStore.handleLogout();
  navigateTo("/auth/login");
};
const routerTabs = [
  {
    route: "/app/home",
    label: "Home",
    icon: "pi pi-home",
  },
  { route: "/app/page2", label: "Page 2", icon: "pi pi-calendar" },
  { route: "/app/page3", label: "Page 3", icon: "pi pi-folder" },
];

data.user_metadata = userStore.user?.user_metadata;
</script>

<style>
#nav-icon3,
#nav-icon4 {
  width: 24px;
  height: 8px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}

#nav-icon1 span,
#nav-icon3 span,
#nav-icon4 span {
  display: block;
  position: absolute;
  height: 5px;
  width: 100%;
  background: #d3531a;
  border-radius: 9px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.25s ease-in-out;
  -moz-transition: 0.25s ease-in-out;
  -o-transition: 0.25s ease-in-out;
  transition: 0.25s ease-in-out;
}

#nav-icon3 span:nth-child(1) {
  top: 0px;
}

#nav-icon3 span:nth-child(2),
#nav-icon3 span:nth-child(3) {
  top: 18px;
}

#nav-icon3 span:nth-child(4) {
  top: 36px;
}

#nav-icon3.open span:nth-child(1) {
  top: 18px;
  width: 0%;
  left: 50%;
}

#nav-icon3.open span:nth-child(2) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

#nav-icon3.open span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

#nav-icon3.open span:nth-child(4) {
  top: 18px;
  width: 0%;
  left: 50%;
}
</style>
