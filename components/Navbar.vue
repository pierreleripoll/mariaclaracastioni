<template>
  <nav :class="`navbar ${whiteBackground}`">
    <ContentNavigation v-slot="{ navigation }">
      <ul class="navbar-menu">
        <li key="/" class="navbar-item">
          <NuxtLink to="/" class="navbar-link navbar-title">
            MARIA CLARA CASTIONI
          </NuxtLink>
        </li>
        <li
          key="menu-button"
          :class="`navbar-item menu-button ${mobileMenuClass}`"
        >
          <NuxtLink to="/" arial-label="Home" class="navbar-link"></NuxtLink>
        </li>
        <li
          ref="spacesNavbarItem"
          :class="`navbar-item navbar-large centeralign ${classHoveredSpaces}`"
        >
          <NuxtLink
            to="/spaces"
            title="Spaces"
            :class="`navbar-link ${
              route.path.startsWith('/spaces') ? 'router-link-active' : ''
            }`"
          >
            Spaces
          </NuxtLink>
        </li>
        <li
          ref="writingsNavbarItem"
          :class="`navbar-item navbar-large rightalign ${classHoveredWords}`"
        >
          <NuxtLink
            to="/words"
            title="Words"
            :class="`navbar-link ${
              route.path.startsWith('/words') ? 'router-link-active' : ''
            }`"
            >Words
          </NuxtLink>
        </li>
        <li
          ref="aboutNavbarItem"
          :class="`navbar-item navbar-large centeralign ${classHoveredAbout}`"
        >
          <NuxtLink
            to="/about/bio"
            title="About"
            :class="`navbar-link ${
              route.path.startsWith('/about') ? 'router-link-active' : ''
            }`"
            >About
          </NuxtLink>
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
          <NuxtLink
            :to="children._path"
            :title="children.title"
            class="dropdown-link"
          >
            {{ children.title }}
          </NuxtLink>
        </li>
      </ul>
      <ul
        ref="dropdownWritings"
        :class="`dropdown-menu ${mobileMenuClass} ${classHoveredWords}`"
      >
        <li :class="`dropdown-menu-title ${mobileMenuClass}`">Words</li>
        <li
          v-for="children of writingsUrls"
          :key="children._path"
          :class="`dropdown-item ${
            isProjectHovered(children._path) ? 'hovered' : ''
          }`"
        >
          <NuxtLink
            :to="children._path"
            :title="children.title"
            class="dropdown-link"
          >
            {{ children.title }}
          </NuxtLink>
        </li>
      </ul>
      <ul
        ref="dropdownAbout"
        :class="`dropdown-menu ${mobileMenuClass} ${classHoveredAbout}`"
      >
        <li :class="`dropdown-menu-title ${mobileMenuClass}`">About</li>
        <li
          v-for="children of aboutUrls"
          :key="children._path"
          :class="`dropdown-item ${
            isProjectHovered(children._path) ? 'hovered' : ''
          }`"
        >
          <NuxtLink
            :to="children._path"
            :title="children.title"
            class="dropdown-link"
          >
            {{ children.title }}
          </NuxtLink>
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
  (item) => item._path === "/words"
)?.children;

const aboutUrls = navigation.value?.find(
  (item) => item._path === "/about"
)?.children;

const dropdownSpaces = ref<HTMLElement | null>(null);
const dropdownWritings = ref<HTMLElement | null>(null);
const spacesNavbarItem = ref<HTMLElement | null>(null);
const writingsNavbarItem = ref<HTMLElement | null>(null);
const aboutNavbarItem = ref<HTMLElement | null>(null);

const hoveredCategory = ref<string | undefined>(undefined);

const mobileMenuOpen = computed(() => route.path == "/");
const mobileMenuClass = computed<string>(() =>
  mobileMenuOpen.value ? "mobile-menu-open" : ""
);
const route = useRoute();

const whiteBackground = computed(() =>
  route.path !== "/" ? "white-background" : ""
);

watch(
  route,
  ({ path }) => {
    if (path.startsWith("/spaces")) {
      hoveredCategory.value = "spaces";
    } else if (path.startsWith("/words")) {
      hoveredCategory.value = "words";
    } else if (path.startsWith("/about")) {
      hoveredCategory.value = "about";
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
  hoveredCategory.value === "spaces" || route.path.startsWith("/spaces")
    ? "hovered"
    : ""
);

const classHoveredWords = computed(() =>
  hoveredCategory.value === "words" || route.path.startsWith("/words")
    ? "hovered"
    : ""
);

const classHoveredAbout = computed(() =>
  hoveredCategory.value === "about" || route.path.startsWith("/about")
    ? "hovered"
    : ""
);

watch(hoveredProject, (value) => {
  if (value?.startsWith("/spaces")) {
    hoveredCategory.value = "spaces";
  } else if (value?.startsWith("/words")) {
    hoveredCategory.value = "words";
  } else if (value?.startsWith("/about")) {
    hoveredCategory.value = "about";
  } else if (value === undefined) {
    hoveredCategory.value = undefined;
  }
});

onMounted(() => {
  spacesNavbarItem.value?.addEventListener("click", () => {
    hoveredCategory.value = "spaces";
  });

  writingsNavbarItem.value?.addEventListener("click", () => {
    hoveredCategory.value = "words";
  });

  aboutNavbarItem.value?.addEventListener("click", () => {
    hoveredCategory.value = "about";
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
  text-transform: uppercase;
  text-align: left;
  /* width: 100%; */
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
  max-width: fit-content;
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

.navbar-title.router-link-active,
.navbar-title.router-link-exact-active {
  text-decoration: none !important;
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
    width: 100%;
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
    font-size: 1.2rem;
  }

  .dropdown-menu {
    display: none;
    padding: 0.5rem 1.5rem;
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
