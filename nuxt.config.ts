export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/fonts"],
  content: {
    documentDriven: true,
  },
  image:
    process.env.NODE_ENV === "production"
      ? {
          provider: "ipx",
          ipx: {
            baseURL: "http://localhost:4000/", // External IPX server for production
          },
        }
      : {},
  routeRules: {
    "/": { prerender: true },
    "/_ipx/**":
      process.env.NODE_ENV === "production"
        ? { proxy: { to: "http://localhost:4000/**" } }
        : {},
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
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
