<script setup lang="ts">
const { page } = useContent();

console.log("Page writings content", page.value);
</script>

<template>
  <ContentRenderer :key="page._id" :value="page" />
</template>
