// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
  ],
  primevue: {
    options: {
      unstyled: true,
    },
    importPT: { as: "Aura", from: "~/presets/aura" }, //import and apply preset
  },
  routeRules: {
    "/": { prerender: true }, // Homepage pre-rendered at build time
    "/app/**": { ssr: false }, //render at build
    "/auth/**": { ssr: false }, //render at build
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  runtimeConfig: {
    // The private keys which are only available within server-side

    SUPABASE_SERVICE_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dXlldHByendvenJhb2NkaWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTg1MDgyMSwiZXhwIjoyMDQxNDI2ODIxfQ.zY5pnpPIjAvv1mtXA7HC6JZ7uLWBztcmzLniScn87Tw",
    RAZORPAY_KEY_SECRET: "Ed8p4gu7onE8aElXBwt99yZ9",
    RAZORPAY_TEST_KEY_SECRET: "CszR4iOLLABdiJfYNAABpwbH", // app specific

    // Keys within public, will be also exposed to the client-side
    public: {
      APP_NAME: "starter",
      APP_TITLE: "Starter",
      RAZORPAY_TEST_KEY_ID: "rzp_test_9lD1CPNz76ZeQk",
      RAZORPAY_KEY_ID: "rzp_live_YPAs5jVumsJApi",
      SUPABASE_URL: "https://zvuyetprzwozraocdibk.supabase.co",
      SUPABASE_KEY:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dXlldHByendvenJhb2NkaWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NTA4MjEsImV4cCI6MjA0MTQyNjgyMX0.B5CUlA1ctv0sJTm0peQGJbRpnXp97ZNfZI_wuHwlJx0",
    },
  },

  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "dark",
    classSuffix: "",
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/redirect",
      exclude: ["/**"],
      // include: ['/app/**'],
      cookieRedirect: true,
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: true,
    },
    clientOptions: {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  },
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  // veeValidate: {
  //   // disable or enable auto imports
  //   autoImports: true,
  //   // Use different names for components
  //   componentNames: {
  //     Form: 'VeeForm',
  //     Field: 'VeeField',
  //     FieldArray: 'VeeFieldArray',
  //     ErrorMessage: 'VeeErrorMessage',
  //   },
  // },
});
