export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/seo",
  ],
  content: {
    documentDriven: true,
  },
  image: {
    // Provider is env-driven so the build can pick where images are transformed:
    //  - unset (local dev / fallback): IPX — sharp transforms at build time.
    //  - "cloudflare" (production on CF): images become /cdn-cgi/image/ URLs
    //    transformed on-demand at the edge, so `nuxt generate` no longer bakes
    //    ~1000 variants. Requires the site served through a Cloudflare-proxied
    //    zone with Images > Transformations enabled (not available on *.workers.dev).
    provider: process.env.NUXT_IMAGE_PROVIDER || "ipx",
    cloudflare: {
      baseURL: process.env.NUXT_IMAGE_BASE_URL || "https://mariaclaracastioni.ch",
    },
    quality: 80,
    densities: [1],
    format: ["webp"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  robots: {
    disallow: ["/api/_content", "/_nuxt", "/admin"],
  },
  // The site uses a single static og:image meta tag (set in app.vue), not
  // satori/chromium-rendered dynamic OG images. Disable the og-image module so
  // we don't pull its renderer, which breaks against unenv 2.x's runtime paths.
  ogImage: { enabled: false },
  sourcemap: false,
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: false,
      // Edge-transformed image URLs have no static route; don't crawl them.
      ignore: ["/cdn-cgi/image"],
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
      "Maria Clara is a scenographer and artist based between Geneva and Lugano. This is a website showcasing her work, including her scenographic projects, exhibitions, and words.",
  },
  sitemap: {
    sources: ["/api/__sitemap__/urls"],
  },
  app: {
    head: {
      title: "Maria Clara Castioni",
      charset: "utf-8",
      viewport: "width=device-width",
    },
  },

  compatibilityDate: "2024-08-26",
});
