<template>
  <Contact class="about" />
  <ContentPage contentType="spaces" />
</template>

<style scoped>
.about {
  display: none;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.5rem 0px;
  z-index: 100;
}

@media screen and (min-width: 600px) {
  .about {
    display: flex;
  }
}
</style>
