<template>
  <div class="w-full h-screen flex justify-center app-container">
    <div class="w-full max-w-lg px-3">
      <div class="px-2 py-50">
        <p class="text-center text-7xl text-gray-700">註冊帳號</p>
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
          <n-input
            v-model:value="formValue.username"
            placeholder="請輸入使用者名稱"
          >
            <template #prefix>
              <n-icon size="18" color="#808695">
                <PersonOutline />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="email">
          <n-input v-model:value="formValue.email" placeholder="請輸入信箱">
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
        <n-form-item path="confirmPassword">
          <n-input
            v-model:value="formValue.confirmPassword"
            type="password"
            show-password-on="click"
            placeholder="請再次輸入密碼"
          >
            <template #prefix>
              <n-icon size="18" color="#808695">
                <LockClosedOutline />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
      <n-button
        type="primary"
        attr-type="submit"
        :loading="loading"
        @click="handleSubmit"
        class="w-20 mt-4"
      >
        註冊
      </n-button>
      <div class="mt-4 text-center">
        <router-link to="/OOAD/login" class="underline text-blue-500"
          >已有帳號？登入</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { register } from "@/api/auth";
import type { FormRules } from "naive-ui";
import { PersonOutline, LockClosedOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const formRef = ref();

const formValue = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const rules: FormRules = {
  username: [
    { required: true, message: "請輸入使用者名稱", trigger: ["blur", "input"] },
  ],
  email: [
    { required: true, message: "請輸入信箱", trigger: ["blur", "input"] },
    { type: "email", message: "信箱格式錯誤", trigger: ["blur", "input"] },
  ],
  password: [
    { required: true, message: "請輸入密碼", trigger: ["blur", "input"] },
    { min: 4, message: "密碼長度至少為4位", trigger: ["blur", "input"] },
  ],
  confirmPassword: [
    { required: true, message: "請再次輸入密碼", trigger: ["blur", "input"] },
    {
      validator(rule, value) {
        return value === formValue.value.password;
      },
      message: "兩次密碼輸入不一致",
      trigger: ["blur", "input"],
    },
  ],
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();
    const response = await register(formValue.value);
    if (response.data && response.data.success === false) {
      message.error(response.data.message || "註冊失敗");
      return;
    }
    setTimeout(() => {
      message.success("註冊成功，請登入");
      router.push("/OOAD/login");
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
}
</style>
