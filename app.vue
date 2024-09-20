<template>
  <div class="app">
    <NuxtRouteAnnouncer />

    <div class="container">
      <div class="header section">
        <Navbar />
      </div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <div class="icons-container">
        <IconProject
          v-for="{ icon, path, title } in projects"
          :key="path"
          :path="path"
          :title="title"
          :icon="icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { title } from "process";
import Navbar from "./components/Navbar.vue";
const { page, layout } = useContent();
const { contentHead } = useRuntimeConfig().public.content;

const { data: writingsContent } = await useAsyncData("writings", () =>
  queryContent("writings").find()
);
const { data: spacesContent } = await useAsyncData("spaces", () =>
  queryContent("spaces").find()
);

const projects = computed(() =>
  [...(spacesContent.value ?? []), ...(writingsContent.value ?? [])].map(
    (d) => ({
      icon: d.icon,
      path: d._path as string,
      title: d.title,
    })
  )
);

useSeoMeta({
  title: "Maria Clara Castioni",
  ogTitle: "Maria Clara Castioni",
  description:
    "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and writings.",
  ogDescription:
    "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and writings.",
});

useHead({
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
        "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and writings.",
    },
  ],
});

// Page not found, set correct status code on SSR
if (!(page as any).value && import.meta.server) {
  const event = useRequestEvent();
  if (event) {
    event.node.res.statusCode = 404;
  }
}

if (contentHead) {
  useContentHead(page);
}
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
  margin-bottom: 10vh;
  gap: 2em;
  width: 100%;
  z-index: 100;
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

@media screen and (min-width: 500px) {
  .header {
    text-align: center;
    position: sticky;
    top: 8px;
    display: flex;
    flex-direction: row;
  }

  .container {
    padding: 0 30px;
  }
}
</style>
