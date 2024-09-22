<!-- components/ImageGallery.vue -->
<template>
  <div class="image-gallery">
    <!-- Navigation Buttons -->
    <div
      :class="['nav-button', 'prev-button', { 'is-activated': prevVisible }]"
      @click="handlePrev"
      aria-label="Previous Image"
      role="button"
      tabindex="0"
      @keypress.enter="handlePrev"
    >
      <!-- Optional: Add arrow icon inside the button for better accessibility -->
      <img src="/right_arrow.min.svg" alt="Previous" class="nav-icon" />
    </div>
    <div
      :class="['nav-button', 'next-button', { 'is-activated': nextVisible }]"
      @click="handleNext"
      aria-label="Next Image"
      role="button"
      tabindex="0"
      @keypress.enter="handleNext"
    >
      <img src="/right_arrow.min.svg" alt="Next" class="nav-icon" />
    </div>

    <!-- Carousel Container -->
    <div class="carousel-container">
      <div class="images-carousel">
        <NuxtPicture
          v-for="(image, index) in images"
          :key="index"
          :class="['project-image', { 'is-hidden': currentIndex !== index }]"
          format="avif,webp"
          :src="image.src"
          sizes="(max-width: 768px) 100vw, 700px"
          densities="x1 x2"
          quality="85"
          :img-attrs="{
            class: 'project-image',
            alt: image.caption,
            loading: 'lazy',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, watch } from "vue";

type Image = {
  caption: string;
  src: string;
};

// Define props to receive images and initial index if needed
const props = defineProps<{
  images: Image[];
  initialIndex?: number;
}>();

const currentIndex = ref(props.initialIndex || 0);

// Watch for changes in images prop to reset currentIndex if necessary
watch(
  () => props.images,
  (newImages) => {
    if (currentIndex.value >= newImages.length) {
      currentIndex.value = newImages.length - 1;
    }
  }
);

const handlePrev = () => {
  if (!props.images.length) return;
  currentIndex.value =
    currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
};

const handleNext = () => {
  if (!props.images.length) return;
  currentIndex.value =
    currentIndex.value === props.images.length - 1 ? 0 : currentIndex.value + 1;
};

const nextVisible = computed(() => {
  return (
    props.images.length > 1 && currentIndex.value < props.images.length - 1
  );
});

const prevVisible = computed(() => {
  return props.images.length > 1 && currentIndex.value > 0;
});
</script>

<style scoped>
.image-gallery {
  position: relative;
  width: 100%;
  height: 100%;
}

.nav-button {
  position: absolute;
  top: 50%;
  background-color: rgba(
    255,
    255,
    255,
    0.7
  ); /* Temporary background for visibility */
  background-position: center;
  background-size: 2.2em;
  background-repeat: no-repeat;
  padding: 0.5em; /* Adjust padding for better sizing */
  /* Removed background-image to use inline <img> for better control */
  display: none;
  z-index: 100;
  cursor: pointer;
  border-radius: 50%; /* Make buttons circular */
  transform: translateY(-50%);
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 1);
}

.prev-button {
  left: 10px; /* Adjust as needed */
}

.next-button {
  right: 10px; /* Adjust as needed */
}

.is-activated {
  display: flex !important; /* Changed to flex to accommodate img */
  align-items: center;
  justify-content: center;
}

.nav-icon {
  width: 24px; /* Adjust size as needed */
  height: 24px;
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
  /* min-width: 400px; */
  height: 60vh;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

.is-hidden {
  display: none;
}
</style>
