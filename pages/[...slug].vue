<template>
  <ContentPage contentType="spaces" />
</template>

<script setup lang="ts">
import ContentPage from "~/components/ContentPage.vue";
const { navigation, page, surround, globals } = useContent();
</script>
