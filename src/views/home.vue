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
                <n-space vertical :size="12">
                  <n-select
                    v-model:value="type"
                    :options="typeOptions"
                    placeholder="選擇類型"
                  />
                  <n-input
                    v-model:value="description"
                    type="text"
                    placeholder="輸入交易描述"
                  />
                  <n-input-number
                    v-model:value="amount"
                    placeholder="輸入金額"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                  />
                  <n-select
                    v-model:value="category"
                    :options="categoryOptions"
                    placeholder="選擇分類"
                  />
                  <n-button
                    type="primary"
                    block
                    @click="addTransaction"
                    :disabled="!description || amount === null || !category"
                  >
                    新增交易
                  </n-button>
                </n-space>
              </n-card>
            </n-space>
          </n-grid-item>

          <n-grid-item :span="2">
            <n-card title="交易歷史" :bordered="false" class="history-card">
              <template v-if="transactions.length === 0">
                <n-empty description="尚無交易記錄" />
              </template>
              <n-scrollbar style="max-height: calc(100vh - 200px)" v-else>
                <n-list>
                  <n-list-item
                    v-for="transaction in transactions"
                    :key="transaction.id"
                  >
                    <n-space
                      justify="space-between"
                      align="center"
                      style="width: 100%"
                    >
                      <n-space vertical size="small" style="max-width: 60%">
                        <span class="transaction-description">
                          {{ transaction.description }}
                        </span>
                        <n-space size="small">
                          <n-tag
                            :type="
                              transaction.type === 'income'
                                ? 'success'
                                : 'error'
                            "
                          >
                            {{
                              transaction.type === "income" ? "收入" : "支出"
                            }}
                          </n-tag>
                          <n-tag>{{ transaction.category }}</n-tag>
                          <span class="transaction-date">{{
                            transaction.date
                          }}</span>
                        </n-space>
                      </n-space>
                      <n-space align="center">
                        <span
                          :class="{
                            'amount-text': true,
                            'income-text': transaction.type === 'income',
                            'expense-text': transaction.type === 'expense',
                          }"
                        >
                          {{ transaction.type === "income" ? "+" : "-" }}
                          {{ transaction.amount.toFixed(2) }}
                        </span>
                        <n-button
                          circle
                          type="error"
                          size="small"
                          @click="removeTransaction(transaction.id)"
                        >
                          ×
                        </n-button>
                      </n-space>
                    </n-space>
                  </n-list-item>
                </n-list>
              </n-scrollbar>
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { ref, computed, onMounted } from "vue";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

const message = useMessage();
const transactions = ref<Transaction[]>([]);
const description = ref("");
const amount = ref<number | null>(null);
const type = ref<"income" | "expense">("expense");
const category = ref<string | null>(null);

const categories = {
  expense: ["飲食", "交通", "購物", "娛樂", "醫療", "其他"],
  income: ["薪資", "獎金", "投資", "其他"],
};

const balance = computed(() => {
  return transactions.value.reduce((sum: number, transaction: Transaction) => {
    return (
      sum +
      (transaction.type === "income" ? transaction.amount : -transaction.amount)
    );
  }, 0);
});

const addTransaction = () => {
  if (!description.value || amount.value === null || !category.value) {
    message.error("請填寫所有必要欄位");
    return;
  }

  transactions.value.push({
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    description: description.value,
    amount: amount.value,
    type: type.value,
    category: category.value,
  });

  message.success("交易新增成功");

  // 清空表單
  description.value = "";
  amount.value = null;
  category.value = null;
};

const removeTransaction = (id: number) => {
  transactions.value = transactions.value.filter(
    (t: Transaction) => t.id !== id
  );
  message.success("交易刪除成功");
};

const typeOptions = [
  { label: "支出", value: "expense" },
  { label: "收入", value: "income" },
];

const categoryOptions = computed(() => {
  return categories[type.value].map((cat) => ({
    label: cat,
    value: cat,
  }));
});

const isSmallScreen = ref(false);

onMounted(() => {
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
  height: 100%;
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
  height: calc(100vh - 48px);
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
