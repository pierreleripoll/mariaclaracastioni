<script setup lang="ts">
import {
  useRuntimeConfig,
  useContent,
  useContentHead,
  useRequestEvent,
} from "#imports";
import type { LayoutKey } from "#build/types/layouts";

const { page, layout } = useContent();

console.log("Goes through document");
</script>

<template>
  <div>
    <ContentRenderer v-if="page" :key="(page as any)._id" :value="page">
      <template #empty="{ value }">
        <DocumentDrivenEmpty :value="value" />
      </template>
    </ContentRenderer>
    <DocumentDrivenNotFound v-else />
  </div>
</template>
