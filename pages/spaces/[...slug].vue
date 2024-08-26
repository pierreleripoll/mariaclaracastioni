<script setup lang="ts">
const { navigation, page, surround, globals } = useContent();

console.log("Page spaces content", page);

type Image = {
  caption: string;
  src: string;
};

const images: Image[] | undefined = page.value?.images;
const year = page.value.year;
const description = page.value?.description;
const credits = page.value?.credits;
</script>

<template>
  <div class="project-container">
    <div class="carousel-container">
      <div class="images-carousel">
        <NuxtPicture
          class=""
          format="avif,webp"
          v-if="images"
          :src="images[0].src"
          :img-attrs="{ class: 'project-image', alt: images[0].caption }"
        />
        <div v-else />
      </div>
    </div>
    <div class="project-content">
      <p class="project-description">
        {{ description }}
      </p>

      <p class="project-credits">
        <span v-if="year" class="project-year"> {{ year }} </span>
        <br />{{ credits.toUpperCase() }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.project-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
}

.project-content {
  z-index: 10;
  max-width: 25vw;
  overflow-y: auto;
  /* font-size: 0.95em; */
}

.project-content {
  position: absolute;
  right: 0;
  bottom: 0;
  max-height: 100vh;
  padding-right: 2em;
  padding-bottom: 2em;
  white-space: pre-wrap;
}

.project-content .project-credits {
  padding-top: 0.5em;
}

.project-content .project-description {
  font-family: Georgia Light, serif;
}

.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.images-carousel {
  position: relative;
  width: 50vw;
  max-width: 600px;
  height: 60vh;
}

:deep().project-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
