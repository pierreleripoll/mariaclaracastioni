<template>
  <NuxtLink :to="path">
    <div
      ref="iconRef"
      :class="classList"
      :style="style"
      @mouseover="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <NuxtPicture
        format="avif,webp,png"
        v-if="props.icon"
        :src="props.icon"
        sizes="200px"
        :width="width"
        :height="width"
        densities="x1 x2"
      />
      <div v-else />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  path: string;
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
const padding = 0;
const containerWidth = computed(() => windowWidth.value - (width + padding));
const containerHeight = computed(() => windowHeight.value - (width + padding));

const x = ref(Math.random() * containerWidth.value + padding);
const y = ref(Math.random() * containerHeight.value + padding);

console.log(x.value, y.value);
const style = computed(
  () =>
    `transform:translate(${x.value - windowWidth.value / 2}px, ${
      y.value - windowHeight.value / 2
    }px);`
);

const getRandomVelocity = () => {
  // Random velocity between -1 and 1
  return Math.random() * 2 - 1;
};

var animationRequestID: number | null = null;

const moveIcon = () => {
  const iconHTML = iconRef.value;
  if (!iconHTML) return;

  let velocity = { x: getRandomVelocity(), y: getRandomVelocity() };
  const stepSize = 3; // Adjust the step size for smoother movement
  let count = 0;
  const updatePosition = () => {
    if (!selected.value) {
      if (count > 10000) {
        velocity = { x: getRandomVelocity(), y: getRandomVelocity() };
        count = 0;
      }
      const newX = x.value + velocity.x * stepSize;
      const newY = y.value + velocity.y * stepSize;

      // Boundary detection to keep the iconHTML within the window
      if (newX < padding || newX > windowWidth.value - (width + padding))
        velocity.x *= -1;
      if (newY < padding || newY > windowHeight.value - (width + padding))
        velocity.y *= -1;

      // Update position with some random velocity
      x.value += velocity.x * stepSize;
      y.value += velocity.y * stepSize;

      count += Math.random() * 10;
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
    console.log("Resize", x.value);
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

onMounted(() => {
  resize();
  moveIcon();
  window.addEventListener("resize", resize);
});
</script>
<style>
.project-icon.dim {
  filter: grayscale(100%) blur(1px);
  z-index: -10;
}

.project-icon {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  display: flex;
  transition: transform 0.8s, filter 0.15s;
  animation-timing-function: ease-in-out;
  will-change: transform;
}
.project-icon > picture > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.project-icon > div {
  width: 50px;
  height: 80px;
  background-color: gray;
  margin: auto;
}

.project-icon.selected {
  z-index: 100;
  transform: translate(0px, calc(100vh - 200px)) !important;
}

.project-icon.hide {
  filter: opacity(0);
  pointer-events: none;
}
</style>
