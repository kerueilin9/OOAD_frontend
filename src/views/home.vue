<template>
  <div class="expense-tracker">
    <n-space vertical size="large">
      <n-card title="記帳工具" :bordered="false" class="main-card">
        <n-grid :cols="3" :x-gap="24">
          <n-grid-item :span="1">
            <n-space vertical :size="24">
              <n-card :bordered="false" class="balance-card">
                <n-statistic label="當前餘額" :value="balance" :precision="2">
                  <template #prefix>
                    {{ balance >= 0 ? "+" : "" }}
                  </template>
                  <template #suffix>元</template>
                </n-statistic>
              </n-card>
              <n-card title="新增交易" :bordered="false" class="form-card">
                <n-form
                  class="text-center"
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
                  新增交易
                </n-button>
              </n-card>
            </n-space>
          </n-grid-item>

          <n-grid-item :span="2">
            <n-card title="交易歷史" :bordered="false" class="history-card">
              <n-data-table
                :row-key="(row) => row.id"
                :columns="columns"
                :data="data"
                :pagination="{
                  pageSize: 10,
                }"
              />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-space>
  </div>
  <EditTransactionModal
    v-model:showModal="isShowModal"
    v-model:transactionData="transactionData"
  />
</template>

<script setup lang="ts">
import { FormInst, FormRules, NButton, useMessage } from "naive-ui";
import { ref, computed, onMounted, h } from "vue";
import type { DataTableColumns } from "naive-ui";
import {
  addTransaction,
  deleteTransaction,
  getTransactionList,
} from "@/api/transaction";
import EditTransactionModal from "@/components/editTransactionModal.vue";

const message = useMessage();
const basicFormRef = ref<FormInst | null>(null);
const submitLoading = ref(false);
const data = ref<RowData[]>([]);
const isShowModal = ref(false);
const transactionData = ref<Transaction | null>(null);

interface Transaction {
  id: number;
  date: Date;
  note: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}

const consumptionCategories = [
  { label: "飲食", value: "FOOD" },
  { label: "交通", value: "TRANSPORT" },
  { label: "購物", value: "SHOPPING" },
  { label: "娛樂", value: "ENTERTAINMENT" },
  { label: "教育", value: "EDUCATION" },
  { label: "醫療", value: "HEALTH" },
  { label: "投資", value: "INVESTMENT" },
  { label: "其他", value: "OTHER" },
];

const incomeCategories = [
  { label: "薪資", value: "SALARY" },
  { label: "投資", value: "INVESTMENT" },
  { label: "其他", value: "OTHER" },
];

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

interface RowData {
  id: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: Date;
  category: string;
  note: string;
}

const columns: DataTableColumns<RowData> = [
  {
    width: 50,
    title: "ID",
    key: "id",
  },
  {
    title: "金額",
    key: "amount",
  },
  {
    title: "收支類型",
    key: "type",
  },
  {
    title: "種類",
    key: "category",
  },
  {
    title: "日期",
    key: "date",
  },
  {
    width: 100,
    ellipsis: true,
    title: "備註",
    key: "note",
  },
  {
    title: "操作",
    key: "actions",
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            onClick: () => {
              editTransaction(row.id);
            },
          },
          { default: () => "編輯" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => {
              removeTransaction(row.id);
            },
          },
          { default: () => "刪除" }
        ),
      ];
    },
  },
];

const categories = computed(() => {
  return basicForm.value.type === "INCOME"
    ? incomeCategories
    : consumptionCategories;
});

const balance = computed(() => {
  return data.value.reduce((sum: number, item: any) => {
    return sum + (item.type === "INCOME" ? item.amount : -item.amount);
  }, 0);
});

const handleSubmit = async () => {
  try {
    await basicFormRef.value.validate();
    submitLoading.value = true;
    const payload = {
      date: new Date().toISOString().split("T")[0],
      ...basicForm.value,
    };

    await addTransaction(payload);
    message.success("交易新增成功");
  } catch (err) {
    console.log(err);
  }
};

const editTransaction = (id: number) => {
  isShowModal.value = true;
  transactionData.value = data.value.find((t: Transaction) => t.id === id);
};

const removeTransaction = async (id: number) => {
  try {
    await deleteTransaction(id);
    message.success("交易刪除成功");
  } catch (err) {
    console.log(err);
  }
};

const isSmallScreen = ref(false);

onMounted(async () => {
  const res = await getTransactionList();
  data.value = res.data;
  // data.value = res.data.map((item: Transaction) => ({
  //   id: item.id,
  //   type: item.type,
  //   amount: item.amount,
  //   date: new Date(item.date).toLocaleDateString("zh-TW"),
  //   category: item.category,
  //   note: item.note,
  // }));

  const handleResize = () => {
    isSmallScreen.value = window.innerWidth <= 640;
  };

  handleResize();
  window.addEventListener("resize", handleResize);
});

const isMobile = computed(() => isSmallScreen.value);
</script>

<style scoped>
.expense-tracker {
  padding: 24px;
}

.main-card {
  height: calc(100vh - 48px);
  background-color: #f5f5f5;
}

.balance-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-card {
  height: calc(100vh - 200px);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transaction-description {
  font-weight: bold;
  word-break: break-all;
}

.transaction-date {
  color: #666;
  font-size: 0.9em;
}

.amount-text {
  font-weight: bold;
  font-size: 1.1em;
}

.income-text {
  color: #18a058;
}

.expense-text {
  color: #d03050;
}
</style>
