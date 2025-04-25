<!-- src/components/AppMenu.vue -->
<script setup lang="ts">
import { h, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { BookOutline, HomeOutline, SettingsOutline } from "@vicons/ionicons5";
import { NIcon } from "naive-ui";

const router = useRouter();
const route = useRoute();

const menuOptions = [
  {
    label: "首頁",
    key: "home",
    icon: () => h(NIcon, null, { default: () => h(HomeOutline) }),
  },
  {
    label: "帳務報表",
    key: "report",
    icon: () => h(NIcon, null, { default: () => h(BookOutline) }),
  },
  {
    label: "設定",
    key: "settings",
    icon: () => h(NIcon, null, { default: () => h(SettingsOutline) }),
  },
];

const handleMenuSelect = (key: string) => {
  router.push({ name: key });
};

const activeRouteKey = computed(() => route.name?.toString() ?? "");
</script>

<template>
  <n-menu
    :value="activeRouteKey"
    :options="menuOptions"
    @update:value="handleMenuSelect"
    :collapsed-width="64"
    :collapsed-icon-size="22"
  />
</template>
