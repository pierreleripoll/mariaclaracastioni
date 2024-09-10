<template>
  <nav class="navbar" @mouseleave="hideBoth">
    <h2 class="navbar-title">MARIA CLARA CASTIONI</h2>

    <ContentNavigation v-slot="{ navigation }">
      <ul class="navbar-menu">
        <li key="/" class="navbar-item">
          <NuxtLink to="/" class="navbar-link"> MARIA CLARA CASTIONI </NuxtLink>
          <ul ref="dropdownSpaces" class="dropdown-menu">
            <li
              v-for="children of spacesUrls"
              :key="children._path"
              :class="`dropdown-item ${
                hoveredProject && hoveredProject !== children._path ? 'dim' : ''
              }`"
              @mouseover="() => (hoveredProject = children._path)"
            >
              <NuxtLink :to="children._path" class="dropdown-link">
                {{ children.title }}
              </NuxtLink>
            </li>
          </ul>
          <ul ref="dropdownWritings" class="dropdown-menu">
            <li
              v-for="children of writingsUrls"
              :key="children._path"
              class="dropdown-item"
            >
              <NuxtLink :to="children._path" class="dropdown-link">
                {{ children.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li ref="spacesNavbarItem" class="navbar-item centeralign">
          <NuxtLink class="navbar-link"> Spaces </NuxtLink>
        </li>
        <li ref="writingsNavbarItem" class="navbar-item centeralign">
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

const hoveredProject = useState<string | undefined>(
  "hoveredProject",
  () => undefined
);

watch(hoveredProject, (value) => {});

const showDropdown = (dropdownRef: globalThis.Ref<HTMLElement | null>) => {
  dropdownRef.value?.classList.add("hovered");
};

const hideDropdown = (dropdownRef: globalThis.Ref<HTMLElement | null>) => {
  dropdownRef.value?.classList.remove("hovered");
};

function hideBoth() {
  hideDropdown(dropdownSpaces);
  hideDropdown(dropdownWritings);
}

onMounted(() => {
  spacesNavbarItem.value?.addEventListener("mouseover", () => {
    showDropdown(dropdownSpaces);
    hideDropdown(dropdownWritings);
  });

  writingsNavbarItem.value?.addEventListener("mouseover", () => {
    showDropdown(dropdownWritings);
    hideDropdown(dropdownSpaces);
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
.dropdown-menu.hovered {
  display: block;
}

.dropdown-item {
  padding: 0.2em 0px;
}

.dropdown-item.dim {
  filter: saturate(0.1) brightness(0.2);
}

.dropdown-link {
  color: black;
  text-decoration: none;
  font-size: 16px;
  width: 100%;
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
