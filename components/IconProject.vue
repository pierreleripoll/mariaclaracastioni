<template>
  <NuxtLink :to="selected ? '/' : path">
    <div
      ref="iconRef"
      :class="classList"
      :style="style"
      @mouseover="onMouseEnter"
      @mouseleave="onMouseLeave"
      @transitionend="onTransitionEnd"
    >
      <NuxtPicture
        format="avif,webp,png"
        v-if="props.icon"
        :src="props.icon"
        sizes="200px"
        :width="width"
        densities="x1 x2"
      />
      <div v-else>
        <span>
          {{ title }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { createNoise2D } from "simplex-noise";

interface Props {
  icon?: string;
  path: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
});

const hoveredProject = useState<string | undefined>(
  "hoveredProject",
  () => undefined
);

const iconRef = ref<HTMLElement | null>(null);

const route = useRoute();
const selected = computed(() => route.path === props.path);
const visible = computed(() => route.path == "/" || selected.value);

const shouldMove = ref(true);

const needsTransformTransitionEffect = ref(selected.value);

watch(visible, (value) => {
  if (!value) {
    setTimeout(() => {
      shouldMove.value = false;
    }, 1500);
  } else shouldMove.value = true;
});

watch(selected, (value) => {
  if (value) {
    needsTransformTransitionEffect.value = true;
  }
});

const classList = computed(
  () =>
    `project-icon ${selected.value ? "selected" : ""} ${
      !visible.value ? "hide" : ""
    } ${
      hoveredProject.value !== props.path && hoveredProject.value ? "dim" : ""
    }`
);

const width = 200;
const windowWidth = ref(window?.innerWidth || 0);
const windowHeight = ref(window?.innerHeight || 0);
const padding = 10;

const x = ref(0);
const y = ref(0);

const style = computed(
  () =>
    `transform: translate(${x.value - windowWidth.value / 2}px, ${
      y.value - windowHeight.value / 2
    }px);` +
    (needsTransformTransitionEffect.value
      ? "transition: opacity 1s, filter 0.2s, transform 1s ease-in-out;"
      : "")
);

const noise = createNoise2D();
let time = Math.random() * 1000;

const moveIcon = () => {
  const speed = 0.0015;
  const amplitudeX = (windowWidth.value - width) / 2 - padding;
  const amplitudeY = (windowHeight.value - width) / 2 - padding;

  const updatePosition = () => {
    if (
      !selected.value &&
      hoveredProject.value !== props.path &&
      !needsTransformTransitionEffect.value &&
      shouldMove.value
    ) {
      time += speed;

      x.value = windowWidth.value / 2 + amplitudeX * noise(time, randomOffsetX);
      y.value =
        windowHeight.value / 2 + amplitudeY * noise(time, randomOffsetY);

      // Ensure the icon stays within bounds
      x.value = Math.max(
        padding,
        Math.min(x.value, windowWidth.value - (width + padding))
      );
      y.value = Math.max(
        padding,
        Math.min(y.value, windowHeight.value - (width + padding))
      );
    }

    requestAnimationFrame(updatePosition);
  };

  // Random offsets to ensure different paths
  const randomOffsetX = Math.random() * 1000;
  const randomOffsetY = Math.random() * 1000;

  updatePosition();
};

const resize = () => {
  const w = window.innerWidth,
    h = window.innerHeight;
  windowWidth.value = w;
  windowHeight.value = h;

  if (x.value > w - (width + padding)) {
    x.value = Math.max(padding, w - (width + padding + 10));
  }
  if (y.value > h - (width + padding)) {
    y.value = Math.max(padding, h - (width + padding + 10));
  }
};

function onMouseEnter() {
  hoveredProject.value = props.path;
}

function onMouseLeave() {
  if (hoveredProject.value === props.path) {
    hoveredProject.value = undefined;
  }
}

function onTransitionEnd(event: TransitionEvent) {
  if (event.propertyName === "transform" && !selected.value) {
    needsTransformTransitionEffect.value = false;
  }
}

onMounted(() => {
  resize();
  moveIcon();
  window.addEventListener("resize", resize);
});
</script>
<style>
.project-icon.dim:not(.hide):not(.selected) {
  filter: grayscale(100%) blur(1px);
  z-index: -10;
  /* No transform changes here */
}

.project-icon {
  position: absolute;
  width: 100px;
  max-height: 200px;
  min-height: 100px;
  height: auto;
  top: calc(50vh);
  left: calc(50vw);
  display: flex;
  opacity: 1;
  transition: opacity 2s, filter 0.2s;
}

.project-icon.selected {
  transition: opacity 2s, filter 0.2s, transform 1s ease-in-out;
  transform: translate(calc(-50vw), calc(100vh - 50vh - 100%)) !important;
  z-index: 100;
}

.project-icon.selected:has(div) {
  transform: translate(
    calc(-50vw + 1.2em),
    calc(100vh - 50vh - 100% - 1.2em)
  ) !important;
}

.project-icon > picture > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.project-icon > div {
  width: 100%;
  height: 141px;
  border: 1px solid black;
  background-color: white;
  margin: auto;
}
.project-icon > div > span {
  text-transform: uppercase;
  color: black;
  display: block;
  margin: 1em;
  width: 50px;
  word-wrap: break-word;
}

.project-icon.hide {
  opacity: 0;
  pointer-events: none;
}
</style>
