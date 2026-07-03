<template>
  <NuxtLink
    :to="path"
    :aria-label="title"
    ref="iconRef"
    :class="classList"
    :style="style"
    @mouseover="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <img v-if="iconData" :src="iconData.src" :alt="`${title} Icon`" />
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

// The manifest is fetched once in app.vue; read it from the Nuxt data cache
// (no extra request, no JS-bundled JSON).
const { data: iconManifest } = useNuxtData<
  Record<string, { src: string; w: number; h: number }>
>("icon-manifest");
const iconData = computed(() =>
  props.icon ? iconManifest.value?.[props.icon] : undefined
);

const category = computed(() => props.path.split("/")[1]);
const route = useRoute();

// The static host 307-redirects to trailing-slash URLs (e.g. /spaces/leggera/),
// so at runtime route.path has a trailing slash while the content path
// (props.path) never does. Compare slash-insensitively, or the selected icon
// resolves as not-selected/not-visible in production and gets hidden.
const stripSlash = (p: string) => p.replace(/\/+$/, "") || "/";
const routePath = computed(() => stripSlash(route.path));
const selected = computed(() => routePath.value === stripSlash(props.path));
const visible = computed(
  () =>
    routePath.value === "/" ||
    routePath.value === "/" + category.value ||
    selected.value
);

// Enable the corner transition only AFTER the icon image has loaded and painted
// (the `ready` class gates the `transform` transition in CSS). The icon-manifest
// is fetched client-side, so on a direct hit / hard reload the icon first paints
// as the text fallback and then swaps to <img> — a swap that shifts its pinned
// position and size. Holding the transition off until past that swap means a
// directly-accessed project shows its icon already in place (no drift), while
// client-side navigation (image already cached) still animates into the corner.
const animationsReady = ref(false);
watch(
  iconData,
  (data) => {
    if (!data || animationsReady.value || !import.meta.client) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (animationsReady.value = true))
    );
  },
  { immediate: true }
);

const classList = computed(
  () =>
    `project-icon ${selected.value ? "selected" : ""} ${
      animationsReady.value ? "ready" : ""
    } ${!visible.value ? "hide" : ""} ${
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
  const sizeVars = iconData.value
    ? `--icon-w: ${iconData.value.w}px; --icon-h: ${iconData.value.h}px; `
    : "";
  if (windowWidth.value === 0 || windowHeight.value === 0) {
    return sizeVars + "opacity: 0;"; // or some default style
  } else
    return (
      sizeVars +
      `transform: translate(${x.value - windowWidth.value / 2}px, ${
        y.value - windowHeight.value / 2
      }px) translate(-50%, -50%);`
    );
});

const noise = createNoise2D();
let time = Math.random() * 1000;
const speed = 0.0008;

// Random offsets to ensure different paths
const randomOffsetX = Math.random() * 1000;
const randomOffsetY = Math.random() * 1000;

let rafId: number | null = null;

const updatePosition = () => {
  time += speed;

  x.value =
    windowWidth.value / 2 + amplitudeX.value * noise(time, randomOffsetX);
  y.value =
    windowHeight.value / 2 + amplitudeY.value * noise(time, randomOffsetY);

  // Ensure the icon stays within bounds
  x.value = Math.max(padding, Math.min(x.value, windowWidth.value - padding));
  y.value = Math.max(padding, Math.min(y.value, windowHeight.value - padding));

  rafId = requestAnimationFrame(updatePosition);
};

const startMoving = () => {
  if (rafId === null) rafId = requestAnimationFrame(updatePosition);
};

const stopMoving = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

// Only animate icons that are actually on screen and free to wander. Hidden
// (off-route) icons, the selected one, and the hovered one go fully idle —
// no rAF loop running — which avoids N always-on loops across all projects.
const shouldAnimate = computed(
  () =>
    visible.value &&
    !selected.value &&
    hoveredProject.value !== props.path
);

watch(
  shouldAnimate,
  (animate) => {
    if (animate) startMoving();
    else stopMoving();
  },
  { flush: "post" }
);

const resize = () => {
  const w = document.documentElement.clientWidth || 0;
  const h = document.documentElement.clientHeight || 0;
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

onMounted(() => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  resize();
  if (shouldAnimate.value) startMoving();
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  stopMoving();
  window.removeEventListener("resize", resize);
});
</script>
<style>
.project-icon.dim:not(.hide):not(.selected) {
  z-index: -10;
  /* No transform changes here */
}

.project-icon {
  position: absolute;
  width: calc(var(--icon-w, 100px) * var(--icon-scale, 1));
  height: calc(var(--icon-h, 141px) * var(--icon-scale, 1));
  top: 50vh;
  left: 50vw;
  display: flex;
  opacity: 1;
  transition: filter 0.2s;
}

.project-icon.selected {
  /* main container is limited to 1500px and there's a 30px horizontal padding */
  transform: translate(calc(max(-750px, -50vw + 30px)), calc(50vh - 8px))
    translateY(-100%) !important;
  z-index: 100;
}

/* Animate into the corner only once the icon image has painted (`ready`). On a
   direct hit / hard reload this is added a frame after the fallback->image swap,
   so the icon appears already in place instead of drifting. */
.project-icon.selected.ready {
  transition: filter 0.2s, transform 1s ease-in-out;
}

.project-icon.selected:has(div) {
  transform: translate(
    calc(max(-750px, -50vw) + 30px + 1.2rem),
    calc(100vh - 50vh - 100% - 1.2em)
  ) !important;
}

.project-icon > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.project-icon > div {
  width: 100%;
  height: 100%;
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
    --icon-scale: 0.7;
  }
  .project-icon.selected {
    transform: translate(calc(-50vw + 0.5rem), 50dvh)
      translateY(calc(-100% - 2rem)) !important;
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
