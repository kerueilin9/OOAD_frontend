<template>
  <n-config-provider>
    <n-loading-bar-provider>
      <n-layout has-sider style="height: 100vh">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          show-trigger
          style="background: #fff"
        >
          <AppMenu />
        </n-layout-sider>
        <n-layout-content style="padding: 0">
          <div class="app-container">
            <router-view />
          </div>
        </n-layout-content>
      </n-layout>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import AppMenu from "@/components/appMenu.vue";
import { onMounted } from "vue";
onMounted(() => {
  console.log("layout loaded");
});
</script>

<style>
.app-container {
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
}
</style>
