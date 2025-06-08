<template>
  <div class="ai-advice-container">
    <n-card title="AI 理財建議" :bordered="false" class="main-card">
      <!-- 輸入區域 -->
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        class="advice-form"
      >
        <n-form-item label="請描述您的理財目標或現況" path="message">
          <n-input
            v-model:value="formData.message"
            type="textarea"
            placeholder="例如：我想要在一年內存到 10 萬元、我不想負債、如何規劃投資等..."
            :rows="4"
            :maxlength="500"
            show-count
          />
        </n-form-item>

        <n-button
          type="primary"
          size="large"
          @click="getAdvice"
          :loading="loading"
          :disabled="!formData.message.trim()"
          class="submit-btn"
        >
          <template #icon>
            <n-icon>
              <SparklesIcon />
            </n-icon>
          </template>
          獲取 AI 建議
        </n-button>
      </n-form>

      <!-- 建議結果區域 -->
      <div v-if="adviceData" class="advice-result" style="margin-top: 24px">
        <n-divider />

        <!-- 難度等級 -->
        <div class="difficulty-section">
          <n-tag
            :type="getDifficultyType(adviceData.difficulty)"
            size="large"
            round
            class="difficulty-tag"
          >
            <template #icon>
              <n-icon>
                <TrendingUpIcon />
              </n-icon>
            </template>
            難度：{{ adviceData.difficulty }}
          </n-tag>
        </div>

        <!-- 分析結果 -->
        <n-card title="財務分析" :bordered="false" class="analysis-card">
          <p class="analysis-text">{{ adviceData.analysis }}</p>
        </n-card>

        <!-- 建議列表 -->
        <n-card title="專業建議" :bordered="false" class="advices-card">
          <n-list>
            <n-list-item
              v-for="(advice, index) in adviceData.advices"
              :key="index"
              class="advice-item"
            >
              <template #prefix>
                <n-avatar
                  :style="{ backgroundColor: getAdviceColor(index) }"
                  :size="32"
                >
                  {{ index + 1 }}
                </n-avatar>
              </template>
              <n-thing>
                <template #header>
                  <span class="advice-title">{{ advice.title }}</span>
                </template>
                <template #description>
                  <p class="advice-content">{{ advice.content }}</p>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>
      </div>

      <!-- 空狀態 -->
      <n-empty
        v-if="!adviceData && !loading"
        description="輸入您的理財目標，讓 AI 為您提供專業建議"
        style="margin-top: 40px"
        size="large"
      >
        <template #icon>
          <n-icon :color="'#d9d9d9'">
            <BulbOutlineIcon />
          </n-icon>
        </template>
      </n-empty>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useMessage, FormInst, FormRules } from "naive-ui";
import { getAIAdvice } from "@/api/aiAgent";
import {
  SparklesOutline as SparklesIcon,
  TrendingUpOutline as TrendingUpIcon,
  BulbOutline as BulbOutlineIcon,
} from "@vicons/ionicons5";

interface AdviceItem {
  title: string;
  content: string;
}

interface AIAdviceResponse {
  difficulty: string;
  analysis: string;
  advices: AdviceItem[];
}

const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const adviceData = ref<AIAdviceResponse | null>(null);

const formData = reactive({
  message: "",
});

const rules: FormRules = {
  message: [
    {
      required: true,
      message: "請輸入您的理財目標或現況",
      trigger: ["blur", "input"],
    },
    {
      min: 5,
      message: "請至少輸入 5 個字符",
      trigger: ["blur", "input"],
    },
  ],
};

const getAdvice = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const response = await getAIAdvice({
      message: formData.message,
    });

    adviceData.value = response.data;
    message.success("AI 建議已生成完成！");
  } catch (error) {
    console.error("獲取 AI 建議失敗：", error);
    message.error("獲取建議失敗，請稍後再試");
  } finally {
    loading.value = false;
  }
};

const getDifficultyType = (difficulty: string) => {
  const difficultyMap: Record<string, "success" | "warning" | "error"> = {
    非常簡單: "success",
    簡單: "success",
    普通: "warning",
    困難: "warning",
    非常困難: "error",
  };
  return difficultyMap[difficulty] || "warning";
};

const getAdviceColor = (index: number) => {
  const colors = ["#18a058", "#2080f0", "#f0a020", "#d03050", "#722ed1"];
  return colors[index % colors.length];
};
</script>

<style scoped>
.ai-advice-container {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.main-card {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.advice-form {
  margin-bottom: 0;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.difficulty-section {
  margin-bottom: 20px;
  text-align: center;
}

.difficulty-tag {
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
}

.analysis-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.analysis-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.advices-card {
  background: #fff;
}

.advice-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.advice-item:last-child {
  border-bottom: none;
}

.advice-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.advice-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 8px 0 0 0;
}

@media (max-width: 768px) {
  .ai-advice-container {
    padding: 16px;
  }

  .submit-btn {
    height: 44px;
    font-size: 15px;
  }

  .advice-title {
    font-size: 15px;
  }

  .advice-content {
    font-size: 13px;
  }
}
</style>
