<template>
  <div ref="iconRef" class="project-icon" :style="style">
    <img v-if="props.icon" :src="props.icon" />
    <div v-else />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  selected?: boolean;
  visible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  selected: false,
  visible: true,
});

const iconRef = ref<HTMLElement | null>(null);

const width = 150;
const windowWidth = ref(window?.innerWidth || 0);
const windowHeight = ref(window?.innerHeight || 0);
const containerWidth = computed(() => windowWidth.value - width * 2);
const containerHeight = computed(() => windowHeight.value - width * 2);

const x = ref(Math.random() * containerWidth.value + width);
const y = ref(Math.random() * containerHeight.value + width);

const style = computed(
  () =>
    `transform:translate(${x.value}px, ${y.value}px); display: ${
      windowWidth.value ? "visible" : "none"
    }`
);

const getRandomVelocity = () => {
  // Random velocity between -1 and 1
  return Math.random() * 2 - 1;
};

const moveIcon = () => {
  const iconHTML = iconRef.value;
  if (!iconHTML) return;

  let velocity = { x: getRandomVelocity(), y: getRandomVelocity() };
  const stepSize = 1; // Adjust the step size for smoother movement
  let count = 0;
  const updatePosition = () => {
    // Update position with some random velocity
    x.value += velocity.x * stepSize;
    y.value += velocity.y * stepSize;
    if (count > 1000) {
      velocity = { x: getRandomVelocity(), y: getRandomVelocity() };
      count = 0;
    }

    // Boundary detection to keep the iconHTML within the window
    if (x.value < 0 || x.value > containerWidth.value - width) velocity.x *= -1;
    if (y.value < 0 || y.value > containerHeight.value - width)
      velocity.y *= -1;
    count += Math.random() * 10;
    requestAnimationFrame(updatePosition);
  };

  updatePosition();
};

onMounted(() => {
  windowHeight.value = window.innerHeight;
  windowWidth.value = window.innerWidth;
  moveIcon();
});
</script>
<style scoped>
.project-icon {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 0;
  left: 0;
  z-index: -100;
  display: flex;
}
.project-icon > img {
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
</style>
