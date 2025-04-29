<template>
  <n-modal v-model:show="showModal" :mask-closable="true" :closable="true">
    <n-card
      style="width: 600px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-card title="編輯交易" :bordered="false" class="form-card">
        <n-form
          ref="basicFormRef"
          require-mark-placement="left"
          label-placement="left"
          :rules="basicRules"
          :model="basicForm"
        >
          <n-form-item path="value">
            <n-input-number
              v-model:value="basicForm.amount"
              placeholder="輸入金額"
              :min="0"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item path="type">
            <n-radio-group
              v-model:value="basicForm.type"
              name="type"
              style="width: 100%"
            >
              <n-radio-button value="EXPENSE" style="width: 50%">
                支出
              </n-radio-button>
              <n-radio-button value="INCOME" style="width: 50%">
                收入
              </n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item path="category">
            <n-select
              size="large"
              class="w-full custom-select-font-size"
              v-model:value="basicForm.category"
              :options="categories"
              placeholder="交易種類"
            />
          </n-form-item>
          <n-form-item path="note">
            <n-input
              size="large"
              class="w-full custom-select-font-size"
              v-model:value="basicForm.note"
              placeholder="描述"
            />
          </n-form-item>
        </n-form>
        <n-button
          type="primary"
          block
          @click="handleSubmit"
          :disabled="!basicForm.amount || basicForm.type === null"
        >
          編輯交易
        </n-button>
      </n-card>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { editTransaction } from "@/api/transaction";
import { FormInst, FormRules, useMessage } from "naive-ui";
import { computed, onMounted, ref, watch } from "vue";
import {
  consumptionCategories,
  incomeCategories,
} from "@/constants/categories";

const showModal = defineModel("showModal");
const transactionData = defineModel<Transaction>("transactionData", {
  default: () => ({
    id: 0,
    date: "",
    note: "",
    amount: 0,
    type: "EXPENSE",
    category: "FOOD",
  }),
});
const message = useMessage();
const basicFormRef = ref<FormInst | null>(null);
const submitLoading = ref(false);

interface Transaction {
  id: number;
  date: Date;
  note: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}

const initialBasicForm = {
  amount: null,
  category: null,
  type: null,
  note: null,
};

const basicForm = ref<{
  amount: number | null;
  category: string | null;
  type: "INCOME" | "EXPENSE" | null;
  note: string | null;
}>({ ...initialBasicForm });

const basicRules: FormRules = {
  amount: {
    required: true,
    trigger: ["blur", "input", "change"],
    type: "number",
    validator: (rule, value: number) => {
      if (value === null || value === undefined || value === 0) {
        return Promise.reject("必填");
      }
      return Promise.resolve();
    },
  },
  type: {
    required: true,
    trigger: ["blur", "input", "change"],
    type: "string",
    validator: (rule, value: string) => {
      if (value === null || value === undefined || value === "") {
        return Promise.reject("必填");
      }
      return Promise.resolve();
    },
  },
};

const categories = computed(() => {
  return basicForm.value.type === "INCOME"
    ? incomeCategories
    : consumptionCategories;
});

const handleSubmit = async () => {
  try {
    await basicFormRef.value.validate();
    submitLoading.value = true;
    const payload = {
      date: new Date().toISOString().split("T")[0],
      ...basicForm.value,
    };

    await editTransaction(transactionData.value.id, payload);
    message.success("交易編輯成功");
  } catch (err) {
    console.log(err);
  }
};

watch(showModal, (val) => {
  if (val) {
    if (transactionData.value) {
      console.log("transactionData", transactionData.value);
      basicForm.value = {
        amount: transactionData.value.amount,
        category: transactionData.value.category,
        type: transactionData.value.type,
        note: transactionData.value.note,
      };
    }
  }
});
</script>
