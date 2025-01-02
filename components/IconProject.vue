<template>
  <NuxtLink
    :to="path"
    :aria-label="title"
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
      sizes="70px sm:100px"
      :width="width"
      densities="x1 x2"
      :alt="`${title} Icon`"
    />
    <div v-else>
      <span>
        {{ title }}
      </span>
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

const category = computed(() => props.path.split("/")[1]);
const route = useRoute();
const selected = computed(() => route.path === props.path);
const visible = computed(
  () =>
    route.path == "/" || route.path == "/" + category.value || selected.value
);

const needsTransformTransitionEffect = ref(selected.value);

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

const width = 100;
const height = 141;
const windowWidth = ref(0);
const windowHeight = ref(0);
const padding = 10;
const amplitudeX = computed(() => windowWidth.value / 2 - padding * 2);
const amplitudeY = computed(() => windowHeight.value / 2 - padding * 2);
//amplitude as computed so udaptes when window size changes

const x = ref(0);
const y = ref(0);

const style = computed(() => {
  if (windowWidth.value === 0 || windowHeight.value === 0) {
    return "opacity: 0;"; // or some default style
  } else
    return (
      `transform: translate(${x.value - windowWidth.value / 2}px, ${
        y.value - windowHeight.value / 2
      }px) translate(-50%, -50%); ` +
      (needsTransformTransitionEffect.value
        ? "transition: filter 0.2s, transform 1s ease-in-out;"
        : "")
    );
});

const moveIcon = () => {
  const noise = createNoise2D();
  let time = Math.random() * 1000;
  const speed = 0.0008;

  // Random offsets to ensure different paths
  const randomOffsetX = Math.random() * 1000;
  const randomOffsetY = Math.random() * 1000;

  const updatePosition = () => {
    if (
      !selected.value &&
      hoveredProject.value !== props.path &&
      !needsTransformTransitionEffect.value &&
      visible.value
    ) {
      time += speed;

      x.value =
        windowWidth.value / 2 + amplitudeX.value * noise(time, randomOffsetX);
      y.value =
        windowHeight.value / 2 + amplitudeY.value * noise(time, randomOffsetY);

      // Ensure the icon stays within bounds
      x.value = Math.max(
        padding,
        Math.min(x.value, windowWidth.value - padding)
      );
      y.value = Math.max(
        padding,
        Math.min(y.value, windowHeight.value - padding)
      );
    }

    requestAnimationFrame(updatePosition);
  };

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
    y.value = Math.max(padding, h - (height + padding + 10));
  }
};

function onMouseEnter() {
  if (visible.value) hoveredProject.value = props.path;
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
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  resize();
  moveIcon();
  window.addEventListener("resize", resize);
});
</script>
<style>
.project-icon.dim:not(.hide):not(.selected) {
  z-index: -10;
  /* No transform changes here */
}

.project-icon {
  position: absolute;
  width: 100px;
  max-height: 145px;
  min-height: 100px;
  height: auto;
  top: 50vh;
  left: 50vw;
  display: flex;
  opacity: 1;
  transition: filter 0.2s;
}

.project-icon.selected {
  transition: filter 0.2s, transform 1s ease-in-out;
  transform: translate(-50vw, calc(50vh - 8px)) translateY(-100%) !important;
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

@media screen and (max-width: 600px) {
  .project-icon {
    width: 70px;
    max-height: 130px;
  }
  .project-icon.selected {
    transform: translate(calc(-50vw + 0.5rem), 50dvh)
      translateY(calc(-100% - 2rem)) !important;
  }

  .project-icon > div {
    height: 99px;
    border: 1px solid black;
    background-color: white;
    margin: auto;
  }

  .project-icon > div > span {
    text-transform: uppercase;
    color: black;
    display: block;
    margin: 0.5em;
    width: 70px;
    word-wrap: break-word;
  }
}
</style>
