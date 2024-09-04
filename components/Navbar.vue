<template>
  <nav class="navbar">
    <h2 class="navbar-title">MARIA CLARA CASTIONI</h2>

    <ContentNavigation v-slot="{ navigation }">
      <ul class="navbar-menu">
        <li key="/" class="navbar-item">
          <NuxtLink to="/" class="navbar-link"> MARIA CLARA CASTIONI </NuxtLink>
        </li>
        <li v-for="link of navigation" :key="link._path" class="navbar-item">
          <NuxtLink
            :to="link.children ? undefined : link._path"
            class="navbar-link"
          >
            {{ link.title }}
          </NuxtLink>
          <ul v-if="link.children" class="dropdown-menu">
            <li
              v-for="children of link.children"
              :key="children._path"
              class="dropdown-item"
            >
              <NuxtLink :to="children._path" class="dropdown-link">
                {{ children.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </ContentNavigation>
  </nav>
</template>

<script setup lang="ts">
const { toc } = useContent();
const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation()
);

const spacesUrls = navigation.value?.find(
  (item) => item._path === "/spaces"
)?.children;

const writingsUrls = navigation.value?.find(
  (item) => item._path === "/writings"
)?.children;

// console.log("Spaces", spaces);
// console.log("writings", writings);
</script>
<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  text-transform: uppercase;
  text-align: left;
  width: 100%;
}

.navbar-title {
  display: none;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 1.5em;
  margin: 0;
  padding: 0;
  width: 100%;
  justify-content: space-between;
}

.navbar-item {
  position: relative;
}

.navbar-link {
  color: black;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 0.5em 0;
  transition: color 0.3s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 4px;
  display: none;
  list-style: none;
  margin: 0;
  padding: 0.5em 0;
}

.navbar-item:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  padding: 0.5em 1em;
}

.dropdown-link {
  color: black;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  .navbar-menu {
    flex-direction: column;
    width: 100%;
  }

  .navbar-item {
    width: 100%;
  }

  .navbar-link {
    display: block;
    width: 100%;
    padding: 0.75em 0;
  }

  .dropdown-menu {
    position: static;
  }

  .dropdown-item {
    padding: 0.75em 1em;
  }
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  .navbar-menu {
    flex-direction: column;
    width: 100%;
  }

  .navbar-item {
    width: 100%;
  }

  .navbar-link {
    display: block;
    width: 100%;
    padding: 0.75em 0;
  }

  .dropdown-menu {
    position: static;
  }

  .dropdown-item {
    padding: 0.75em 1em;
  }
}
</style>
