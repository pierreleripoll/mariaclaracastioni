<template>
  <UnLazyImage
    :thumbhash="thumbhash"
    :src="image.src"
    :alt="alt"
    :sources="sources"
    :width="image.width"
    :height="image.height"
    :auto-sizes="true"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  lazy: {
    type: Boolean,
    default: true,
  },
  thumbhash: {
    type: String,
    default: null,
  },
  image: {
    type: Object,
    required: true,
  },
  format: {
    type: String,
    default: "webp",
    required: false,
  },
  aspectRatio: {
    type: Number,
    default: undefined,
    required: false,
  },
  quality: {
    type: [Number, String],
    default: 90,
    required: false,
  },
  sizes: {
    type: String,
    default: "300px  xl:600px",
    required: false,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});

const alt = computed(() => {
  return props.image.caption || props.image.alt || "Image";
});

const thumbhash = computed(() => {
  return props.thumbhash || props.image.thumbhash;
});

const aspectRatio = computed(() => {
  return props.aspectRatio || props.image.ratio;
});

const img = useImage();

const sources = computed(() => {
  // Debug mode: don't load actual images
  if (props.debug) {
    return [];
  }

  const webpSizes = img.getSizes(props.image.src, {
    sizes: props.sizes,
    modifiers: {
      quality: props.quality,
      format: "webp",
    },
  });
  const jpegSizes = img.getSizes(props.image.src, {
    sizes: props.sizes,
    modifiers: {
      quality: props.quality,
      format: "jpeg",
    },
  });
  const sourcesComputed = [
    {
      type: "image/webp",
      srcSet: webpSizes.srcset,
    },
    {
      type: "image/jpeg",
      srcSet: jpegSizes.srcset,
    },
  ];
  // console.log("sourcesComputed", sourcesComputed);
  return sourcesComputed;
});
</script>

<style scoped>
/* No custom styles needed - UnLazyImage renders as picture element */
</style>
