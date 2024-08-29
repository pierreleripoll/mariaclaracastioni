<script setup lang="ts">
const { navigation, page, surround, globals } = useContent();

const idxImage = ref(0);

type Image = {
  caption: string;
  src: string;
};

const images: Image[] | undefined = page.value?.images;
const year = page.value.year;
const description = page.value?.description;
const credits = page.value?.credits;

const handlePrev = () => {
  if (!images) return;
  idxImage.value =
    idxImage.value === 0 ? images.length - 1 : idxImage.value - 1;
};

const handleNext = () => {
  if (!images) return;
  idxImage.value =
    idxImage.value === images.length - 1 ? 0 : idxImage.value + 1;
};

const nextVisible = computed(() => {
  if (!images || images.length === 1) return false;
  return idxImage.value < images.length - 1;
});

const prevVisible = computed(() => {
  if (!images || images.length === 1) return false;
  return idxImage.value > 0;
});
</script>

<template>
  <div class="project-container">
    <div
      :class="prevVisible ? 'is-activated' : ''"
      id="button-prev"
      @click="handlePrev"
    ></div>
    <div
      :class="nextVisible ? 'is-activated' : ''"
      id="button-next"
      @click="handleNext"
    ></div>
    <div class="carousel-container">
      <div class="images-carousel">
        <NuxtPicture
          v-for="(image, index) in images"
          :class="['project-image', { 'is-hidden': idxImage !== index }]"
          format="avif,webp"
          :src="image.src"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :img-attrs="{ class: 'project-image', alt: image.caption }"
        />
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
  max-width: 350px;
  overflow-y: auto;
  /* font-size: 0.95em; */
}

.project-content {
  position: absolute;
  right: 0;
  bottom: 0;
  max-height: 100vh;
  padding-right: 1em;
  padding-bottom: 1em;
  white-space: pre-wrap;
}

.project-content .project-credits {
  padding-top: 0.5em;
  font-size: smaller;
  line-height: 1.2em;
}

.project-content .project-description {
  font-family: Georgia Light, serif;
  line-height: 1.2em;
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
  width: calc(25vw + 350px);
  max-width: 800px;
  min-width: 400px;
  height: 60vh;
}

:deep().project-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.project-image.is-hidden {
  display: none;
}

#button-prev,
#button-next {
  position: absolute;
  top: 50%;
  background-position: center;
  background-size: 2.2em;
  background-repeat: no-repeat;
  padding: 2em 3em;
  background-image: url("/right_arrow.svg");
  display: none;
  z-index: 100;
  cursor: pointer;
}

#button-prev {
  left: 25vw;
  transform: translate(-55%, -50%) rotate(180deg);
}

#button-next {
  right: 25vw;
  transform: translate(55%, -50%);
}

.is-activated {
  display: block !important;
}
</style>
