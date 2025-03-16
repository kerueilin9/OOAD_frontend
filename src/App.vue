<script setup lang="ts">
import { h, ref, computed, onMounted } from "vue";
import {
  NConfigProvider,
  NMessageProvider,
  NLayout,
  NLayoutSider,
  NMenu,
  NLayoutContent,
  NIcon,
  NButton,
} from "naive-ui";
import {
  BookOutline,
  HomeOutline,
  SettingsOutline,
  MenuOutline,
} from "@vicons/ionicons5";
import ExpenseTracker from "./components/ExpenseTracker.vue";

const menuOptions = [
  {
    label: "首頁",
    key: "home",
    icon: () => h(NIcon, null, { default: () => h(HomeOutline) }),
  },
  {
    label: "帳務報表",
    key: "expense",
    icon: () => h(NIcon, null, { default: () => h(BookOutline) }),
  },
  {
    label: "設定",
    key: "settings",
    icon: () => h(NIcon, null, { default: () => h(SettingsOutline) }),
  },
];

const activeKey = ref("expense");
const showSider = ref(true);
const isSmallScreen = ref(false);

onMounted(() => {
  const handleResize = () => {
    isSmallScreen.value = window.innerWidth <= 1024;
  };
  handleResize();
  window.addEventListener("resize", handleResize);
});

const isMobile = computed(() => isSmallScreen.value);
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-layout has-sider style="height: 100vh">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          show-trigger
          style="background: #fff"
        >
          <n-menu
            v-model:value="activeKey"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout-content style="padding: 0">
          <div class="app-container">
            <ExpenseTracker v-if="activeKey === 'expense'" />
            <div v-else-if="activeKey === 'home'" class="content-placeholder">
              首頁內容
            </div>
            <div
              v-else-if="activeKey === 'settings'"
              class="content-placeholder"
            >
              設定內容
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
.app-container {
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.content-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  color: #999;
}
</style>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
