// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
  ],
  primevue: {
    options: {
        unstyled: true
    },
    importPT: { as: 'Aura', from: '~/presets/aura' }     //import and apply preset
},
css: ['~/assets/css/main.css'],
colorMode: {
  preference: 'system', // default value of $colorMode.preference
  fallback: 'dark',
  classSuffix: '',
},
supabase: {
  redirectOptions: {
    login: '/auth/login',
    callback: '/auth/redirect',
    exclude: ['/**'],
    // include: ['/app/**'],
    cookieRedirect: true,
    
  },
  cookieOptions: {
    maxAge: 60 * 60 * 8,
    sameSite: 'lax',
    secure: true
  },
  clientOptions: {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
  
},
alias: {
  pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
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
})