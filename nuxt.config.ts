// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@nuxt/icon', '@nuxtjs/color-mode'],
  primevue: {
    options: {
        unstyled: true
    },
    importPT: { as: 'Aura', from: '~/presets/aura' }     //import and apply preset
},
css: ['~/assets/css/main.css'],

})
