<template>
  <div class="project-container">
    <!-- Navigation Buttons -->
    <div
      :class="`navigation-button ${prevVisible ? 'is-activated' : ''}`"
      id="button-prev"
      @click="handlePrev"
      aria-label="Previous Image"
      role="button"
      tabindex="1"
      @keypress.enter="handlePrev"
    ></div>
    <div
      :class="`navigation-button ${nextVisible ? 'is-activated' : ''}`"
      id="button-next"
      @click="handleNext"
      aria-label="Next Image"
      role="button"
      tabindex="1"
      @keypress.enter="handleNext"
    ></div>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <!-- Project Content -->
      <div class="project-content">
        <p class="project-description">
          {{ description }}
        </p>

        <p class="project-credits">
          <span v-if="year" class="project-year"> {{ year }} </span>
          <br />{{ credits.toUpperCase() }}
        </p>
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
              sizes="(max-width: 768px) 100vw, 800px"
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
import { ref, computed, defineProps } from "vue";

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

const { navigation, page, surround, globals } = useContent();

// Image carousel logic
const idxImage = ref(0);
const images: Image[] | undefined = page.value?.images;
const year = page.value?.year;
const description = page.value?.description;
const credits = page.value?.credits;

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
  /* min-width: 400px; */
  height: 60vh;
}

:deep(.project-image) {
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
  background-image: url("/right_arrow.min.svg");
  display: none;
  z-index: 100;
  cursor: pointer;
}

#button-prev {
  left: calc((25vw + 350px) / 2);
  transform: translate(-55%, -50%) rotate(180deg);
}

#button-next {
  right: 25vw;
  transform: translate(55%, -50%);
}

.is-activated {
  display: block !important;
}

@media screen and (max-width: 1500px) {
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

  #button-prev {
    left: 20vw;
    top: 80%;
    transform: translate(-50%, -50%) rotate(270deg);
  }

  #button-next {
    left: 20vw;
    top: 90%;
    transform: translate(-50%, -50%) rotate(90deg);
  }

  /* 
  .images-carousel .project-image:first-child {
    margin-top: 300px;
  } */
}

@media (max-width: 600px) {
  .navigation-button {
    display: none !important;
  }

  .project-container {
    display: block;
    box-sizing: border-box;
    padding: 2.3em;
    padding-top: 1em;
  }

  .project-content {
    position: inherit;
    padding: 0px;
    max-height: none;
    max-width: none;
    font-size: 1.2em;
    overflow-y: visible;
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
  }

  .image-wrapper {
    height: auto;
  }

  .images-carousel {
    gap: 3em;
    margin: 3em auto;
    width: 100%;
  }
}
</style>
