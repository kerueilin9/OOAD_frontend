<template>
  <div class="w-full h-screen flex justify-center app-container">
    <div class="w-full max-w-lg px-3">
      <div class="px-2 py-50">
        <p class="text-center text-7xl text-gray-700">記帳系統</p>
      </div>

      <n-form
        ref="formRef"
        label-placement="left"
        size="large"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <n-form-item path="username">
          <n-input v-model:value="formValue.username" placeholder="請輸入帳號">
            <template #prefix>
              <n-icon size="18" color="#808695">
                <PersonOutline />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            placeholder="請輸入密碼"
          >
            <template #prefix>
              <n-icon size="18" color="#808695">
                <LockClosedOutline />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <div class="flex justify-between">
            <div class="flex-initial">
              <n-checkbox v-model:checked="autoLogin" text-color="blue"
                >自動登入</n-checkbox
              >
              <!-- <router-link to="/forget-password" class="underline">忘記密碼</router-link> -->
            </div>
          </div>
        </n-form-item>
      </n-form>
      <n-button
        type="primary"
        attr-type="submit"
        :loading="loading"
        @click="handleSubmit"
        class="w-20"
      >
        登入
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { login } from "@/api/auth";
import type { FormRules } from "naive-ui";
import { PersonOutline, LockClosedOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const autoLogin = ref(false);
const formRef = ref();

const formValue = ref({
  username: "",
  password: "",
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "請輸入帳號",
      trigger: ["blur", "input"],
    },
  ],
  password: [
    {
      required: true,
      message: "請輸入密碼",
      trigger: ["blur", "input"],
    },
    {
      min: 4,
      message: "密碼長度至少為4位",
      trigger: ["blur", "input"],
    },
  ],
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();

    const response = await login(formValue.value);
    const token = response.data;
    if (token == "帳號密碼錯誤") {
      message.error("登入失敗，請檢查帳號密碼");
      return;
    }
    setTimeout(() => {
      message.success("登入成功");
      localStorage.setItem("token", token);
      router.push("/OOAD/home");
    }, 1000);
  } catch (errors) {
    message.error("請檢查輸入的內容");
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.app-container {
  height: 100vh;
  background-color: #f5f5f5;
  /* overflow-y: auto; */
}
</style>
