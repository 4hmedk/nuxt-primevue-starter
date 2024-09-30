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
    RAZORPAY_TEST_KEY_SECRET: "CszR4iOLLABdiJfYNAABpwbH",
    LEMONSQUEEZY_API_TEST_KEY_1:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI2NWIwOTNhZDhmY2M4ZGI4YzU5OTI2OTJmN2Y4MzFmNWVhMjBjNTYzYmFiYWU5OWFiOTFhOWViNmYxZjQ1ODk1NGIyODQzOTM3NWRmODlhYiIsImlhdCI6MTcyNzQ1NjUzOS4yNTczNiwibmJmIjoxNzI3NDU2NTM5LjI1NzM2MywiZXhwIjoyMDQyOTg5MzM5LjIyNTg3Miwic3ViIjoiMzQxODI2MSIsInNjb3BlcyI6W119.H8k3ZbcVJBoL_NYubAvdY6IpZodpjcfOAp5PFgb5GfUIY_YBv5SCnu7c8MoS1Pul6g75ts0Qpt3So18Sc0yIW_kW4cVxGFiQEl8YGym1uf_s2nK3WrL35-cFiOFKzLwOwYPeialIGhN6zNMfBTziKuPtGnFyzQxpb85ZsZ46SxYDlsd8uhuV2RScJ-kV8qkUerdboPk3P2MYtEYn3XaLwW2WnAaVEZVzepTTVx2bVx0Dccwk-jXlmGFvOx5dRZus4yn1GXRzY7W_Fi7IH1I3clIdJsziOAOJIgPP0qQWcOYR2P65ORkgioHMIQCeWNQKhb8umm4Vh4JtPuHW-8WXeSspcgVCbS9Ay5RVutNlA7i4H-d0Qp4M4DTaHkhFvpbxaxFtpoZ4hkgZ8r8fXZAlp9-IvDqy4ktusIqhC39Y2KF0-wS2fRQHJ6aEoDlrnRqczZPeq6-sct8_QOPvZWHFarxGUQKwmHRP-54RuZkRbAuxCwavq1SuBUvgi7-eq1Of",
    LEMONSQUEEZY_WEBHOOK_SECRET: "ec878820fe40023161f92f58b760d7e2",
    // app specific

    // Keys within public, will be also exposed to the client-side
    public: {
      RAZORPAY_TEST_KEY_ID: "rzp_test_9lD1CPNz76ZeQk",
      RAZORPAY_KEY_ID: "rzp_live_YPAs5jVumsJApi",
      SUPABASE_URL: "https://zvuyetprzwozraocdibk.supabase.co",
      SUPABASE_KEY:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dXlldHByendvenJhb2NkaWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NTA4MjEsImV4cCI6MjA0MTQyNjgyMX0.B5CUlA1ctv0sJTm0peQGJbRpnXp97ZNfZI_wuHwlJx0",
      //app specific
      APP_NAME: "starter",
      APP_TITLE: "Starter",
      LEMONSQUEEZY_TEST_STORE_ID: "125988",
      BASE_URL: process.env.BASE_URL || "http://localhost:3000",
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
