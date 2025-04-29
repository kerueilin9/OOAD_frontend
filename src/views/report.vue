<template>
  <div class="report-container">
    <n-card :bordered="false" class="form-card">
      <template #header>
        <n-space vertical :size="8">
          <p class="text-2xl text-center font-bold">帳務查詢</p>
        </n-space>
      </template>
      <n-space vertical :size="24">
        <n-form
          ref="filterFormRef"
          :model="filterForm"
          label-placement="left"
          :label-width="80"
        >
          <n-form-item label="交易類型" path="type" class="max-w-lg">
            <n-select
              v-model:value="filterForm.type"
              :options="typeOptions"
              placeholder="選擇交易類型"
              clearable
            />
          </n-form-item>
          <n-form-item label="分類" path="category" class="max-w-lg">
            <n-select
              multiple
              key="label"
              v-model:value="filterForm.category"
              :options="categories"
              placeholder="選擇分類"
              clearable
            />
          </n-form-item>
          <n-form-item label="日期範圍" path="dateRange" class="max-w-lg">
            <n-date-picker
              :formatted-value="
                filterForm.startDate && filterForm.endDate
                  ? [filterForm.startDate, filterForm.endDate]
                  : null
              "
              value-format="yyyy-MM-dd"
              type="daterange"
              clearable
              @update:formatted-value="(value: [string, string]) => {
                if(value) {
                  filterForm.startDate = value[0];
                  filterForm.endDate = value[1];
                }else {
                  filterForm.startDate = null;
                  filterForm.endDate = null;
                }
              }"
            />
          </n-form-item>
          <n-form-item label="金額範圍" path="amountRange" class="max-w-lg">
            <div>
              <n-slider
                :value="[filterForm.minAmount, filterForm.maxAmount]"
                range
                :step="1"
                :max="10000"
                :on-update:value="(value: number[]) => {
                  filterForm.minAmount = value[0] > value[1] ? value[1] : value[0];
                  filterForm.maxAmount = value[1] > value[0] ? value[1] : value[0];
                }"
              />
              <n-space style="margin-top: 8px">
                <n-input-number
                  v-model:value="filterForm.minAmount"
                  size="small"
                  class="w-52"
                />
                <n-input-number
                  v-model:value="filterForm.maxAmount"
                  size="small"
                  class="w-52"
                />
              </n-space>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleFilter">篩選</n-button>
          </n-form-item>
        </n-form>

        <!-- 交易列表 -->
        <n-data-table
          :columns="columns"
          :data="filteredTransactions"
          :pagination="pagination"
          :loading="loading"
        />
      </n-space>
    </n-card>
  </div>
  <EditTransactionModal
    v-model:showModal="isShowModal"
    v-model:transactionData="transactionData"
  />
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { NTag, NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import {
  consumptionCategories,
  incomeCategories,
} from "@/constants/categories";
import EditTransactionModal from "@/components/editTransactionModal.vue";
import { deleteTransaction, getTransactionList } from "@/api/transaction";
import { start } from "repl";

const router = useRouter();
const message = useMessage();
const isShowModal = ref(false);
const transactionData = ref<Transaction | null>(null);

interface Transaction {
  id: number;
  type: "INCOME" | "EXPENSE";
  note: string;
  amount: number;
  category: string;
  date: Date;
}

const filterFormRef = ref();

const initialFilterForm = {
  type: null,
  category: null,
  startDate: null,
  endDate: null,
  minAmount: 0,
  maxAmount: 10000,
};

const filterForm = ref<{
  type: string | null;
  category: string[] | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}>(initialFilterForm);

const typeOptions = ref([
  { label: "收入", value: "INCOME" },
  { label: "支出", value: "EXPENSE" },
]);

const columns: DataTableColumns<Transaction> = [
  {
    title: "日期",
    key: "date",
    width: 120,
  },
  {
    title: "描述",
    key: "note",
    width: 200,
  },
  {
    title: "類型",
    key: "type",
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.type === "income" ? "success" : "error",
        },
        { default: () => (row.type === "income" ? "收入" : "支出") }
      );
    },
  },
  {
    title: "分類",
    key: "category",
    width: 100,
  },
  {
    title: "金額",
    key: "amount",
    width: 120,
    render(row) {
      return h(
        "span",
        {
          class: row.type === "income" ? "text-green-600" : "text-red-600",
        },
        `${row.type === "income" ? "+" : "-"}${row.amount.toFixed(2)}`
      );
    },
  },
  {
    title: "操作",
    key: "actions",
    width: 100,
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

const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  onChange: (page: number) => {
    pagination.value.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
  },
});

const loading = ref(false);
const filteredTransactions = ref<Transaction[]>([]);

const handleFilter = async () => {
  loading.value = true;
  const payload = {
    ...filterForm.value,
  };
  console.log("Filter payload:", payload);
  const response = await getTransactionList(payload);
  filteredTransactions.value = response.data;
  loading.value = false;
};

const editTransaction = (id: number) => {
  isShowModal.value = true;
  transactionData.value = filteredTransactions.value.find(
    (t: Transaction) => t.id === id
  );
};

const removeTransaction = async (id: number) => {
  try {
    await deleteTransaction(id);
    message.success("交易刪除成功");
  } catch (err) {
    console.log(err);
  }
};

const categories = computed(() => {
  if (filterForm.value.type === null) {
    return [...consumptionCategories, { label: "薪資", value: "SALARY" }];
  }
  return filterForm.value.type === "INCOME"
    ? incomeCategories
    : consumptionCategories;
});

onMounted(async () => {
  loading.value = true;
  const response = await getTransactionList({});
  filteredTransactions.value = response.data;
  loading.value = false;
});
</script>

<style scoped>
.report-container {
  padding: 24px;
  height: 100%;
  background-color: #f5f5f5;
}

.form-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
