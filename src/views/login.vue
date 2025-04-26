<template>
  <div class="w-full h-screen flex justify-center items-center app-container">
    <div class="w-1/2 max-w-xs px-3">
      <div class="px-2 py-3">
        <!-- <div> -->
        <!--   <img :src="websiteConfig.loginImage" alt="" /> -->
        <!-- </div> -->
        <h1 class="text-center text-lg text-red-300">記帳系統</h1>
      </div>

      <n-form
        ref="formRef"
        label-placement="left"
        size="large"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <n-form-item path="account" label="帳號">
          <n-input v-model:value="formValue.account" placeholder="請輸入帳號">
            <template #prefix>
              <n-icon size="18" color="#808695">
                <PersonOutline />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password" label="密碼">
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
        size="large"
        :loading="loading"
        class="font-bold w-1/2"
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
import type { FormRules } from "naive-ui";
import { PersonOutline, LockClosedOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const autoLogin = ref(false);
const formRef = ref();

const formValue = ref({
  account: "",
  password: "",
});

const rules: FormRules = {
  account: [
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
      message: "密碼長度至少為6位",
      trigger: ["blur", "input"],
    },
  ],
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();

    // TODO: 這裡添加實際的登入API調用
    // 模擬登入成功
    setTimeout(() => {
      message.success("登入成功");
      localStorage.setItem("isAuthenticated", "true");
      router.push("/");
    }, 1000);
  } catch (errors) {
    message.error("請檢查輸入的內容");
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.test {
  color: #ee2626;
}

.app-container {
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
}
</style>
