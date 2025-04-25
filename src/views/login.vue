<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="w-full max-w-xs px-3">
      <div class="px-2 py-3">
        <!-- <div> -->
        <!--   <img :src="websiteConfig.loginImage" alt="" /> -->
        <!-- </div> -->
        <h1 class="text-center text-lg text-zinc-700">
          {{ websiteConfig.loginDesc }}
        </h1>
      </div>

      <n-form
        ref="formRef"
        label-placement="left"
        size="large"
        :model="formInline"
        :rules="rules"
      >
        <n-form-item path="account" label="帳號">
          <n-input v-model:value="formInline.account" placeholder="email">
            <template #prefix>
              <n-icon size="18" color="#808695">
                <PersonOutline />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password" label="密碼">
          <n-input
            v-model:value="formInline.password"
            type="password"
            showPasswordOn="click"
            placeholder="password"
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
              <n-checkbox v-model:checked="autoLogin">自動登入</n-checkbox>
              <!-- <router-link to="/forget-password" class="underline">忘記密碼</router-link> -->
            </div>
          </div>
        </n-form-item>
        <n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
            @click="handleSubmit"
            size="large"
            :loading="loading"
            block
            class="font-bold"
          >
            登入
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>
