<template>
  <nav :class="`navbar ${whiteBackground}`">
    <ContentNavigation v-slot="{ navigation }">
      <ul class="navbar-menu">
        <li key="/" class="navbar-item">
          <NuxtLink to="/" class="navbar-link"> MARIA CLARA CASTIONI </NuxtLink>
        </li>
        <li
          key="menu-button"
          :class="`navbar-item menu-button ${mobileMenuClass}`"
        >
          <NuxtLink to="/" class="navbar-link"></NuxtLink>
        </li>
        <li
          ref="spacesNavbarItem"
          :class="`navbar-item navbar-large centeralign ${classHoveredSpaces}`"
        >
          <NuxtLink
            to="/spaces"
            :class="`navbar-link ${
              route.path.startsWith('/spaces') ? 'router-link-active' : ''
            }`"
          >
            Spaces
          </NuxtLink>
        </li>
        <li
          ref="writingsNavbarItem"
          :class="`navbar-item navbar-large centeralign ${classHoveredWritings}`"
        >
          <NuxtLink
            to="/writings"
            :class="`navbar-link ${
              route.path.startsWith('/writings') ? 'router-link-active' : ''
            }`"
            >Writings
          </NuxtLink>
        </li>
        <li class="navbar-item rightalign navbar-large">
          <NuxtLink to="/about" class="navbar-link"> About </NuxtLink>
        </li>
      </ul>
      <ul
        ref="dropdownSpaces"
        :class="`dropdown-menu ${mobileMenuClass} ${classHoveredSpaces}`"
      >
        <li :class="`dropdown-menu-title ${mobileMenuClass}`">Spaces</li>
        <li
          v-for="children of spacesUrls"
          :key="children._path"
          :class="`dropdown-item ${
            isProjectHovered(children._path) ? 'hovered' : ''
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
        :class="`dropdown-menu ${mobileMenuClass} ${classHoveredWritings}`"
      >
        <li :class="`dropdown-menu-title ${mobileMenuClass}`">Writings</li>
        <li
          v-for="children of writingsUrls"
          :key="children._path"
          :class="`dropdown-item ${
            isProjectHovered(children._path) ? 'hovered' : ''
          }`"
        >
          <NuxtLink :to="children._path" class="dropdown-link">
            {{ children.title }}
          </NuxtLink>
        </li>
      </ul>
      <ul :class="`dropdown-menu ${mobileMenuClass}`">
        <li :class="`dropdown-item ${mobileMenuClass}`">
          <NuxtLink to="/dates" class="dropdown-link"> Dates </NuxtLink>
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

const mobileMenuOpen = computed(() => route.path == "/");
const mobileMenuClass = computed<string>(() =>
  mobileMenuOpen.value ? "mobile-menu-open" : ""
);
const route = useRoute();

const whiteBackground = computed(() =>
  route.path !== "/" ? "white-background" : ""
);
const pageTitle = computed(() => {
  const pages = navigation.value?.map((d) => d.children ?? d).flat();
  return pages?.find((d) => d._path == route.path)?.title;
});

watch(
  route,
  ({ path }) => {
    if (path.startsWith("/spaces")) {
      hoveredCategory.value = "spaces";
    } else if (path.startsWith("/writings")) {
      hoveredCategory.value = "writings";
    } else {
      hoveredCategory.value = undefined;
    }
  },
  { immediate: true }
);

function isProjectHovered(path: string) {
  return (
    (hoveredProject.value && hoveredProject.value == path) || route.path == path
  );
}

const hoveredProject = useState<string | undefined>(
  "hoveredProject",
  () => undefined
);

const classHoveredSpaces = computed(() =>
  route.path.startsWith("/spaces") ? "hovered" : ""
);

const classHoveredWritings = computed(() =>
  hoveredCategory.value === "writings" ? "hovered" : ""
);

watch(hoveredProject, (value) => {
  console.log("hoveredProject", value);

  if (value?.startsWith("/spaces")) {
    hoveredCategory.value = "spaces";
  } else if (value?.startsWith("/writings")) {
    hoveredCategory.value = "writings";
  } else if (value === undefined) {
    hoveredCategory.value = undefined;
  }
});

watch(hoveredCategory, (value) => {
  console.log("hoveredCategory", value);
});

onMounted(() => {
  spacesNavbarItem.value?.addEventListener("click", () => {
    hoveredCategory.value = "spaces";
  });

  writingsNavbarItem.value?.addEventListener("click", () => {
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

.menu-button {
  display: none;
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
  /* width: 100%; */
}

.navbar-title {
  display: none;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  /* width: 100%; */
  justify-content: space-between;
}

.navbar-item {
  position: relative;
}

.navbar-link {
  color: black;
  cursor: pointer;

  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 0.5rem 0;
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
  padding: 0.5rem 0;
  width: 100vw;
}

.dropdown-item {
  padding: 0.2rem 0px;
}

.dropdown-link {
  color: black;
  text-decoration: none;
  font-size: 16px;
  /* width: 100%; */
  font-weight: 400;
}

li.hovered > a,
li:hover > a {
  font-style: italic;
  text-decoration: underline dotted;
  -webkit-text-decoration: underline dotted;
  text-underline-offset: 2px;
  -webkit-text-underline-offset: underline dotted;
}

.router-link-active,
.router-link-exact-active {
  font-style: normal !important;
  text-decoration: underline !important;
  -webkit-text-decoration: underline !important;
  text-underline-offset: 2px;
  -webkit-text-underline-offset: underline !important;
}

@media screen and (min-width: 600px) {
  .dropdown-menu.hovered,
  .dropdown-menu:hover {
    display: block !important;
  }
  .navbar-menu,
  .navbar {
    width: 100%;
  }
  .dropdown-menu-title {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .navbar-large {
    display: none;
  }

  .menu-button {
    display: block;
  }
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-title {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  }

  .navbar-menu {
    flex-direction: column;
  }

  .navbar-link {
    display: block;
    /* width: 100%; */
    padding: 0.75rem 0;
  }

  .dropdown-menu {
    position: static;
    width: auto;
  }

  .dropdown-menu.visible,
  .dropdown-item.visible {
    display: block;
  }

  .dropdown-item {
    padding: 0.75rem 1rem;
  }
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 0.5rem;
    /* width: calc(100vw - 1em); */
    /* position: absolute; */
    /* top: 0; */
    /* left: 0; */
    /* padding: 1em 2em; */
    /* width: calc(100vw - 4em); */
    font-size: 1.2rem !important;
  }

  .navbar.white-background {
    background: white;
  }

  .navbar-menu {
    flex-direction: column;
    /* width: 100%; */
    gap: 3px;
  }

  .navbar-link {
    display: block;
    /* width: 100%; */
    font-size: 1em;
  }

  .dropdown-menu {
    display: none;
    padding: 0.5rem 1rem;
    /* position: ; */
  }
  .dropdown-menu-title {
    font-style: italic;
    margin-bottom: 0.2rem;
  }
  .dropdown-item {
    padding: 0px;
  }
  .dropdown-link {
    font-size: inherit;
  }

  .mobile-menu-open {
    display: block !important;
  }

  .centeralign,
  .rightalign {
    text-align: left;
  }

  .menu-button > a {
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/right_arrow.min.svg");
    transform: scale(-1, 1);
    z-index: 100;
    width: 1.5rem;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
  }

  .menu-button.mobile-menu-open > a {
    display: none;
    /* transform: rotate(-180deg); */
    /* transform: scale(-1, 1); */
  }
}
</style>
