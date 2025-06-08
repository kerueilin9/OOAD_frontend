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
          <n-form-item path="amount">
            <n-input-number
              v-model:value="basicForm.amount"
              placeholder="輸入金額"
              :min="0"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item path="date">
            <n-date-picker
              v-model:formatted-value="basicForm.date"
              type="date"
              placeholder="選擇日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
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
const props = defineProps<{
  updateData: (data: Transaction) => void;
}>();

interface Transaction {
  id: number;
  date: string;
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
  date: new Date().toISOString().split("T")[0],
};

const basicForm = ref<{
  amount: number | null;
  category: string | null;
  type: "INCOME" | "EXPENSE" | null;
  note: string | null;
  date: string;
}>({ ...initialBasicForm });

const basicRules: FormRules = {
  amount: {
    required: true,
    trigger: ["blur", "input", "change"],
    type: "number",
    validator: (rule, value: number) => {
      if (value === null || value === undefined || value === 0) {
        return Promise.reject("不可為0");
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
  date: {
    required: true,
    trigger: ["blur", "input", "change"],
    type: "string",
    validator: (rule, value: string) => {
      if (!value) {
        return Promise.reject("請選擇日期");
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

    // 確保日期格式正確
    let dateValue = basicForm.value.date;
    if (typeof dateValue !== "string") {
      dateValue = new Date().toISOString().split("T")[0];
    }

    const payload = {
      ...basicForm.value,
      date: dateValue,
    };

    const res = await editTransaction(transactionData.value.id, payload);
    props.updateData(res.data.transaction);
    message.success("交易編輯成功");
    showModal.value = false;
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
        date: transactionData.value.date,
      };
    }
  }
});
</script>
