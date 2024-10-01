export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/fonts", "@nuxtjs/seo"],
  content: {
    documentDriven: true,
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
  devServer: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 3000, // Ensure this matches your desired port
  },
  site: {
    url: "https://mariaclaracastioni.ch/",
    name: "Maria Clara Castioni",
    description:
      "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and words.",
    defaultLocale: "en", // not needed if you have @nuxtjs/i18n installed
  },
  app: {
    head: {
      title: "Maria Clara Castioni",
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-8",
      viewport: "width=device-width",
    },
  },

  compatibilityDate: "2024-08-26",
});
