<template>
  <DocumentDrivenNotFound v-if="notFound" />
  <div v-else class="project-container">
    <div class="dropdown-link page-title">
      {{ pageTitle }}
    </div>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <!-- Navigation Buttons -->
      <div class="navigation-arrows-container">
        <div
          :class="`navigation-button ${prevVisible ? 'is-activated' : ''}`"
          id="button-prev"
          @click="handlePrev"
          aria-label="Previous Image"
          role="button"
          tabindex="0"
          @keypress.enter="handlePrev"
        ></div>
        <div
          :class="`navigation-button ${nextVisible ? 'is-activated' : ''}`"
          id="button-next"
          @click="handleNext"
          aria-label="Next Image"
          role="button"
          tabindex="0"
          @keypress.enter="handleNext"
        ></div>
      </div>

      <!-- Project Content -->
      <div class="project-content">
        <div v-if="description" class="project-description">
          <MDC :value="description" />
        </div>
        <div v-if="credits" class="project-credits">
          <span v-if="year" class="project-year"> {{ year }} </span>
          <br v-if="year && credits" />
          <MDC :value="credits" />
        </div>
      </div>

      <!-- Image Carousel -->
      <div class="carousel-container" ref="carouselContainer">
        <div class="images-carousel" ref="imagesCarousel">
          <div
            v-for="(image, index) in images"
            :key="image.caption"
            class="image-wrapper"
            :data-index="index"
            :path="image.src"
            ref="imageWrappers"
          >
            <NuxtPicture
              :class="['project-image', { 'is-hidden': idxImage !== index }]"
              format="avif,webp"
              :src="image.src"
              sizes="450px md:600px xl:900px"
              densities="x1 x2"
              quality="90"
              loading="lazy"
              :img-attrs="{
                class: 'project-image',
                alt: image.caption,
                loading: 'lazy',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

type Image = {
  caption: string;
  src: string;
};

// Define props to handle different content types if necessary
const props = defineProps({
  contentType: {
    type: String,
    required: true, // e.g., 'spaces' or 'writings'
  },
});

const { page } = useContent();

const notFound = computed(() => !page.value);

if (!(page as any).value && import.meta.server) {
  const event = useRequestEvent();
  if (event) {
    event.node.res.statusCode = 404;
  }
}

// Image carousel logic
const idxImage = ref(0);
const images: Image[] | undefined = page.value?.images;
const year = page.value?.year;
const description = page.value?.description || null;
const credits = page.value?.credits;
const pageTitle = page.value?.title ?? "No title";

const handlePrev = () => {
  if (!images) return;
  idxImage.value =
    idxImage.value === 0 ? images.length - 1 : idxImage.value - 1;
  scrollToImage(idxImage.value);
};

const handleNext = () => {
  if (!images) return;
  idxImage.value =
    idxImage.value === images.length - 1 ? 0 : idxImage.value + 1;
  scrollToImage(idxImage.value);
};

const nextVisible = computed(() => {
  if (!images || images.length === 1) return false;
  return idxImage.value < images.length - 1;
});

const prevVisible = computed(() => {
  if (!images || images.length === 1) return false;
  return idxImage.value > 0;
});

// References
const imagesCarousel = ref<HTMLElement | null>(null);
const carouselContainer = ref<HTMLElement | null>(null);
const imageWrappers = ref<HTMLElement[]>([]);

// Intersection Observer Instance
const observer = ref<IntersectionObserver | null>(null);

// Function to handle intersection changes
const onIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = Number(entry.target.getAttribute("data-index"));
      if (!isNaN(index)) {
        idxImage.value = index;
      }
    }
  });
};

// Function to scroll to a specific image
const scrollToImage = (index: number) => {
  const target = imageWrappers.value[index];

  if (target && carouselContainer.value) {
    carouselContainer.value.scrollTo({
      top: target.offsetTop,
      behavior: "smooth",
    });
  }
};

onMounted(() => {
  if (!carouselContainer.value) return;

  // Create Intersection Observer
  observer.value = new IntersectionObserver(onIntersection, {
    root: carouselContainer.value,
    threshold: 0.6, // 60% of the image must be visible
  });

  // Observe each image wrapper
  imageWrappers.value.forEach((wrapper) => {
    observer.value?.observe(wrapper);
  });
});

onBeforeUnmount(() => {
  if (observer) {
    observer.value?.disconnect();
  }
});
</script>

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
  width: 350px;
  overflow-y: auto;
  /* font-size: 0.95em; */
}

.project-content {
  position: relative;
  right: 0;
  bottom: 0;
  max-height: 100vh;
  padding-right: 1em;
  padding-bottom: 1em;
  white-space: pre-wrap;
  z-index: 10;
  /* text-align: justify; */
  /* Allows automatic hyphenation based on the language */
  /* hyphens: auto;  */
  word-break: break-word; /* Prevents words from being too long and breaking the layout */
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

.project-credits {
  text-transform: uppercase;
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
}

.images-carousel {
  position: relative;

  width: calc(25vw + 350px);
  max-width: 800px;
  /* min-width: 400px; */
  height: 60vh;
}

:deep(.project-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

:deep(p) {
  margin: 0;
}

.about {
  display: none;
}

.project-image.is-hidden {
  display: none;
}

.page-title {
  display: none;
}
.carousel-container {
  display: flex;
  flex-direction: column;
  height: fit-content;
  overflow-y: auto;
  gap: 10em;
  height: 100%;
  justify-content: start;
}
.images-carousel {
  margin-top: max(100px, 20vh);
  margin-bottom: max(100px, 20vh);
  display: flex;
  gap: calc(35vh - 100px);
  flex-direction: column;
  height: auto;
  scroll-behavior: smooth; /* Smooth scrolling */
  scroll-snap-type: y mandatory; /* Enable scroll snapping */
}
.image-wrapper {
  scroll-snap-align: start; /* Snap to the start of each image */
  height: 60vh; /* Ensure each image takes up the container's height */
  display: flex;
  justify-content: center;
  align-items: center;
}
.project-image.is-hidden {
  display: block;
}

.content-wrapper {
  display: flex;
  flex-direction: row;
}

.navigation-arrows-container {
  display: flex;
  justify-content: end;
  padding-right: 1rem;
  flex-direction: column;
}
#button-prev,
#button-next {
  position: relative;
  background-position: center;
  background-size: 1.5em;
  background-repeat: no-repeat;
  padding: 2em 1em;
  background-image: url("/right_arrow.min.svg");
  visibility: hidden;
  z-index: 100;
  cursor: pointer;
  transform-origin: center;
}

#button-prev {
  transform: rotate(270deg);
}

#button-next {
  transform: rotate(90deg);
}

.is-activated {
  visibility: visible !important;
}

.project-description :deep(br) {
  content: " ";
}

@media screen and (max-width: 600px) {
  .navigation-button {
    display: none !important;
  }

  .page-title {
    display: block;
    text-transform: uppercase;
    font-size: 1.2rem;
  }

  .project-container {
    display: block;
    box-sizing: border-box;
    padding: 2rem;
    padding-top: 0px;
  }

  .project-content {
    position: inherit;
    padding: 0px;
    max-height: none;
    max-width: none;
    width: auto;
    font-size: 1.1rem;
    overflow-y: visible;
    margin: 0px;
  }

  .project-credits,
  .project-description {
    margin: 0px;
  }

  .project-credits.about {
    display: flex;
  }

  .carousel-container {
    position: inherit;
    width: 100%;
    overflow-y: visible;
  }
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-bottom: 140px;
  }

  .image-wrapper {
    height: auto;
  }

  .images-carousel {
    gap: 1rem;
    margin: 0px;
    width: 100%;
  }

  .images-carousel:not(:empty) {
    padding-top: 1rem;
  }
}
</style>
