<script setup lang="ts">
const { navigation, page, surround, globals } = useContent();

console.log("Page spaces content", page);
</script>

<template>
  <h1>{{ page.title }}</h1>
  <ContentRenderer :key="page._id" :value="page">
    <template #empty>
      <p>No content found.</p>
    </template>
  </ContentRenderer>
</template>
