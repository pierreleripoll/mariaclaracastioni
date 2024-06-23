<template>
  <nav class="navbar">
    <ul>
      <li><nuxt-link to="/spaces">SPACES</nuxt-link></li>
      <li><nuxt-link to="/writings">WRITINGS</nuxt-link></li>
      <li><nuxt-link to="/about">ABOUT</nuxt-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.navbar {
  width: 200px;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #000;
  color: #fff;
  padding: 20px;
}
.navbar ul {
  list-style: none;
  padding: 0;
}
.navbar ul li a {
  color: #fff;
  text-decoration: none;
}
</style>
