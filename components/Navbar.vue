<template>
  <nav class="navbar">
    <h2 class="navbar-title">MARIA CLARA CASTIONI</h2>

    <ContentNavigation v-slot="{ navigation }">
      <ul class="navbar-menu">
        <li key="/" class="navbar-item navbar-link-home">
          <NuxtLink to="/" class="navbar-link navbar-link-home">
            MARIA CLARA CASTIONI
          </NuxtLink>
          <ul
            ref="dropdownSpaces"
            :class="`dropdown-menu ${classHoveredSpaces}`"
          >
            <li
              v-for="children of spacesUrls"
              :key="children._path"
              :class="`dropdown-item ${
                hoveredProject && hoveredProject == children._path
                  ? 'hovered'
                  : ''
              }`"
              @mouseover="() => (hoveredProject = children._path)"
              @mouseleave="
                () =>
                  hoveredProject == children._path
                    ? (hoveredProject = undefined)
                    : null
              "
            >
              <NuxtLink :to="children._path" class="dropdown-link">
                {{ children.title }}
              </NuxtLink>
            </li>
          </ul>
          <ul
            ref="dropdownWritings"
            :class="`dropdown-menu ${classHoveredWritings}`"
          >
            <li
              v-for="children of writingsUrls"
              :key="children._path"
              :class="`dropdown-item ${
                hoveredProject && hoveredProject == children._path
                  ? 'hovered'
                  : ''
              }`"
            >
              <NuxtLink :to="children._path" class="dropdown-link">
                {{ children.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li
          ref="spacesNavbarItem"
          :class="`navbar-item centeralign ${classHoveredSpaces}`"
        >
          <NuxtLink class="navbar-link"> Spaces </NuxtLink>
        </li>
        <li
          ref="writingsNavbarItem"
          :class="`navbar-item centeralign ${classHoveredWritings}`"
        >
          <NuxtLink class="navbar-link"> Writings </NuxtLink>
        </li>
        <li class="navbar-item rightalign">
          <NuxtLink to="/about" class="navbar-link"> About </NuxtLink>
        </li>
      </ul>
    </ContentNavigation>
  </nav>
</template>

<script setup lang="ts">
const { toc } = useContent();
import { useRoute } from "vue-router";
const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation()
);

const spacesUrls = navigation.value?.find(
  (item) => item._path === "/spaces"
)?.children;

const writingsUrls = navigation.value?.find(
  (item) => item._path === "/writings"
)?.children;

const dropdownSpaces = ref<HTMLElement | null>(null);
const dropdownWritings = ref<HTMLElement | null>(null);
const spacesNavbarItem = ref<HTMLElement | null>(null);
const writingsNavbarItem = ref<HTMLElement | null>(null);

const hoveredCategory = ref<string | undefined>(undefined);

const route = useRoute();

watch(route, (value) => {
  console.log(value);
});

const hoveredProject = useState<string | undefined>(
  "hoveredProject",
  () => undefined
);

const classHoveredSpaces = computed(() =>
  hoveredCategory.value === "spaces" ? "hovered" : ""
);

const classHoveredWritings = computed(() =>
  hoveredCategory.value === "writings" ? "hovered" : ""
);

watch(hoveredProject, (value) => {
  if (value?.startsWith("/spaces")) {
    hoveredCategory.value = "spaces";
  } else if (value?.startsWith("/writings")) {
    hoveredCategory.value = "writings";
  } else {
    // hoveredCategory.value = undefined;
  }
});

onMounted(() => {
  spacesNavbarItem.value?.addEventListener("mouseover", () => {
    hoveredCategory.value = "spaces";
  });

  writingsNavbarItem.value?.addEventListener("mouseover", () => {
    hoveredCategory.value = "writings";
  });
});
</script>
<style scoped>
.centeralign {
  text-align: center;
}

.rightalign {
  text-align: right;
}

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
  min-width: 150px;
}

.navbar-link {
  color: black;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 0.5em 0;
  transition: color 0.3s ease;
}
.navbar-link-home {
  text-decoration: none !important;
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
  width: 100vw;
}
.dropdown-menu.hovered,
.dropdown-menu:hover {
  display: block;
}

.dropdown-item {
  padding: 0.2em 0px;
}

.dropdown-link {
  color: black;
  text-decoration: none;
  font-size: 16px;
  width: 100%;
  font-weight: 400;
}

li.hovered,
li:hover,
.router-link-active,
.router-link-exact-active {
  text-decoration: underline;
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
