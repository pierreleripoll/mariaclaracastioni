<template>
  <div class="app">
    <NuxtRouteAnnouncer />

    <div class="container">
      <div class="header section">
        <Navbar>
          <template v-slot:icons>
            <div class="icons-container">
              <IconProject
                v-for="{ icon, path, title } in projects"
                :key="path"
                :path="path"
                :title="title"
                :icon="icon"
              /></div
          ></template>
        </Navbar>
      </div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { title } from "process";
import Navbar from "./components/Navbar.vue";
const { page, layout } = useContent();
const { contentHead } = useRuntimeConfig().public.content;

const { data: wordsContent } = await useAsyncData("words", () =>
  queryContent("words").find()
);
const { data: spacesContent } = await useAsyncData("spaces", () =>
  queryContent("spaces").find()
);

const projects = computed(() =>
  [...(spacesContent.value ?? []), ...(wordsContent.value ?? [])]
    .map((d) => ({
      icon: d.icon,
      path: d._path as string,
      title: d.title,
    }))
    .filter((d) => d.title)
);

useSeoMeta({
  title: "Maria Clara Castioni",
  ogTitle: "Maria Clara Castioni",
  ogImage: "/android-chrome-192x192.png",
  description:
    "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and words.",
  ogDescription:
    "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and words.",
});

useHead({
  script: [
    {
      src: "https://cloud.umami.is/script.js",
      defer: true,
      "data-website-id": "b8436e6a-506a-41ec-921f-d24f377f3620",
    },
  ],
  title: "Maria Clara Castioni",
  titleTemplate: (titleChunk) => {
    return titleChunk == "Maria Clara Castioni" || !titleChunk
      ? "Maria Clara Castioni"
      : `${titleChunk} - Maria Clara Castioni`;
  },
  meta: [
    {
      name: "description",
      content:
        "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and words.",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
  link: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
    },
  ],
});

// Page not found, set correct status code on SSR
// if (!(page as any).value && import.meta.server) {
//   const event = useRequestEvent();
//   if (event) {
//     event.node.res.statusCode = 404;
//   }
// }

if (contentHead) {
  useContentHead(page);
}

onMounted(() => {
  interface Window {
    netlifyIdentity?: {
      on: (event: string, callback: (user?: any) => void) => void;
    };
  }
  if (window && window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user) {
        window.netlifyIdentity?.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
});
</script>
<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Helvetica", Arial, sans-serif;
  height: 100vh;
  overflow: hidden;
}

#__nuxt {
  height: 100vh;
}

.app {
  position: relative;
  height: 100%;
}

.container {
  font-family: Helvetica, Arial, sans-serif;
  margin-top: -8px;
  padding: 1em 2em;
  text-align: start;
  max-width: 1500px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.header {
  justify-content: space-between;
  text-align: start;
  margin: 0 auto;
  gap: 2em;
  width: 100%;
  z-index: 10;
}

.header h1 {
  font-size: 36px;
  font-weight: bold;
  text-align: start;
  flex-shrink: 1;
}

.header h2 {
  font-size: 24px;
  font-weight: normal;
  margin: auto 0;
  flex-shrink: 2;
}

a {
  color: var(--color-text);
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
}

a:hover {
  font-style: italic;
  text-decoration: underline dotted;
  -webkit-text-decoration: underline dotted;
  text-underline-offset: 2px;
  -webkit-text-underline-offset: underline dotted;
}

.icons-container {
  top: 50%;
  left: 0;
  z-index: 0;
}

@media screen and (max-width: 600px) {
  .container {
    height: 100vh;
    padding: 0px;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .header {
    position: sticky;
    left: 0px;
    top: 0px;
    z-index: 102;

    /* background-color: white; */
    /* width: calc(100vw - 1em); */
    margin-bottom: 0px;
  }
}
@media screen and (min-width: 600px) {
  .header {
    text-align: center;
    padding-top: 8px;
    display: flex;
    flex-direction: row;
  }

  .container {
    padding: 0 30px;
  }
}
</style>
