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
      <ClientOnly>
        <div class="icons-container">
          <IconProject v-for="icon in icons" :key="icon" :icon="icon" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";

const { page, layout } = useContent();
const { contentHead } = useRuntimeConfig().public.content;

const { data: spacesContent } = await useAsyncData("home", () =>
  queryContent("spaces").find()
);

const icons = spacesContent.value?.map((d) => d.icon);
console.log("ICONS", icons);

useSeoMeta({
  title: "Maria Clara Castioni",
  ogTitle: "Maria Clara Castioni",
  description:
    "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and writings.",
  ogDescription:
    "Maria Clara Castioni's work presentation, including her scenographic projects, exhibitions, and writings.",
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
.app {
  position: relative;
}
.container {
  font-family: "Helvetica Neue", Arial, sans-serif;
  margin-top: -8px;
  padding: 1em 2em;
  text-align: start;
  max-width: 1500px;
  margin: auto;
}

.header {
  justify-content: space-between;
  text-align: start;
  margin: 0 auto;
  margin-bottom: 10vh;
  gap: 2em;
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
