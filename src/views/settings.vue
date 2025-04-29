<template>
  <div class="settings-container">
    <n-card title="設定" :bordered="false">
      <n-space vertical :size="24">
        <!-- 設定內容 -->
        <n-form
          ref="settingsFormRef"
          :model="settingsForm"
          label-placement="left"
          :label-width="120"
        >
          <n-form-item label="主題顏色">
            <n-color-picker v-model:value="settingsForm.themeColor" />
          </n-form-item>
          <n-form-item label="語言">
            <n-select
              v-model:value="settingsForm.language"
              :options="languageOptions"
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSave">儲存設定</n-button>
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";

const router = useRouter();
const message = useMessage();
const settingsFormRef = ref();

const settingsForm = ref({
  themeColor: "#18a058",
  language: "zh-TW",
});

const languageOptions = [
  { label: "繁體中文", value: "zh-TW" },
  { label: "English", value: "en" },
];

const handleSave = () => {
  message.success("設定已儲存");
};

onMounted(() => {});
</script>

<style scoped>
.settings-container {
  padding: 24px;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
