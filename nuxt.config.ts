// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxt/image"],
  content: {
    documentDriven: true,
  },
  routeRules: {
    "/": { prerender: true },
  },
  app: {
    head: {
      title: "Maria Clara Castioni",
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
