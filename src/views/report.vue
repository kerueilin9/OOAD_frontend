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
              :on-update:value="(value: string) => {
                filterForm.category = null;
                filterForm.type = value;
              }"
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
                :step="10"
                :max="100000"
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
          <n-form-item label="-" class="max-w-lg" label-style="font-size: 0">
            <n-button type="primary" @click="handleFilter" class="ml-2"
              >篩選</n-button
            >
          </n-form-item>
        </n-form>

        <!-- 交易列表 -->
        <n-data-table
          :columns="columns"
          :data="filteredTransactions"
          :pagination="pagination"
          :loading="loading"
        />

        <!-- 圖表區域 -->
        <n-card title="六個月統計圖表" :bordered="false" class="chart-card">
          <n-tabs type="line" animated>
            <n-tab-pane name="monthly" tab="月度收支統計">
              <EchartsComponent :option="monthlyChartOption" height="400px" />
            </n-tab-pane>
            <n-tab-pane name="category" tab="分類統計">
              <EchartsComponent :option="categoryChartOption" height="400px" />
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-space>
    </n-card>
  </div>
  <EditTransactionModal
    v-model:showModal="isShowModal"
    v-model:transactionData="transactionData"
    :updateData="updateData"
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
import EchartsComponent from "@/components/EchartsComponent.vue";
import {
  deleteTransaction,
  getTransactionList,
  getTransactionChart,
} from "@/api/transaction";
import { CategoryMap } from "@/enums/categoryEnum";

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
  minAmount: null,
  maxAmount: null,
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
          type: row.type === "INCOME" ? "success" : "error",
        },
        { default: () => (row.type === "INCOME" ? "收入" : "支出") }
      );
    },
  },
  {
    title: "分類",
    key: "category",
    width: 100,
    render(row) {
      return h(NTag, {}, { default: () => `${CategoryMap.get(row.category)}` });
    },
  },
  {
    title: "金額",
    key: "amount",
    width: 120,
    render(row) {
      return h(
        "span",
        {
          class: row.type === "INCOME" ? "text-green-600" : "text-red-600",
        },
        `${row.type === "INCOME" ? "+" : "-"}${row.amount.toFixed(2)}`
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
const chartData = ref<any>(null);

const updateData = (updatedTransaction: Transaction) => {
  const index = filteredTransactions.value.findIndex(
    (t: Transaction) => t.id === updatedTransaction.id
  );
  if (index !== -1) {
    filteredTransactions.value[index] = updatedTransaction;
  }
};

const handleFilter = async () => {
  loading.value = true;
  try {
    const payload = {
      ...filterForm.value,
    };
    console.log("Filter payload:", payload);

    // 同時更新交易列表和圖表數據
    const [transactionResponse] = await Promise.all([
      getTransactionList(payload),
    ]);

    filteredTransactions.value = transactionResponse.data;
  } catch (error) {
    console.error("篩選數據失敗:", error);
    message.error("篩選數據失敗");
  }
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

// 圖表配置
const categoryChartOption = computed(() => {
  // 統計各分類的金額
  const categoryStats: { [key: string]: number } = {};

  filteredTransactions.value.forEach((transaction) => {
    const categoryName =
      CategoryMap.get(transaction.category) || transaction.category;
    if (!categoryStats[categoryName]) {
      categoryStats[categoryName] = 0;
    }
    categoryStats[categoryName] += transaction.amount;
  });

  const data = Object.entries(categoryStats).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    title: {
      text: "分類統計",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "金額",
        type: "pie",
        radius: "50%",
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
});

const monthlyChartOption = computed(() => {
  if (!chartData.value || !chartData.value.summaries) {
    return {};
  }

  const summaries = chartData.value.summaries;
  const months = summaries.map(
    (item: any) => `${item.year}-${String(item.month).padStart(2, "0")}`
  );
  const incomeData = summaries.map((item: any) => item.totalIncome);
  const expenseData = summaries.map((item: any) => item.totalExpense);
  const balanceData = summaries.map((item: any) => item.balance);

  return {
    title: {
      text: "六個月收支統計",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ["收入", "支出", "餘額"],
      top: 30,
    },
    xAxis: [
      {
        type: "category",
        data: months,
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "金額",
        min: 0,
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "餘額",
        axisLabel: {
          formatter: "{value}",
        },
      },
    ],
    series: [
      {
        name: "收入",
        type: "bar",
        data: incomeData,
        itemStyle: {
          color: "#18a058",
        },
      },
      {
        name: "支出",
        type: "bar",
        data: expenseData,
        itemStyle: {
          color: "#d03050",
        },
      },
      {
        name: "餘額",
        type: "line",
        yAxisIndex: 1,
        data: balanceData,
        itemStyle: {
          color: "#2080f0",
        },
      },
    ],
  };
});

onMounted(async () => {
  loading.value = true;
  try {
    // 載入交易列表
    const transactionResponse = await getTransactionList({});
    filteredTransactions.value = transactionResponse.data;

    // 載入六個月統計圖表數據
    const chartResponse = await getTransactionChart();
    chartData.value = chartResponse.data;
  } catch (error) {
    console.error("載入數據失敗:", error);
    message.error("載入數據失敗");
  }
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

.chart-card {
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
