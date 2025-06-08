<template>
  <div class="chart-container">
    <div ref="chartRef" :style="{ width: '100%', height: height }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useECharts } from "@/plugins/echarts";

interface ChartProps {
  option: any;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<ChartProps>(), {
  height: "400px",
  width: "100%",
});

const chartRef = ref<HTMLDivElement>();
const echarts = useECharts();
let chartInstance: any = null;

const initChart = () => {
  if (chartRef.value && !chartInstance) {
    chartInstance = echarts.init(chartRef.value);
    setOption();
  }
};

const setOption = () => {
  if (chartInstance && props.option) {
    chartInstance.setOption(props.option, true);
  }
};

const resize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

watch(
  () => props.option,
  () => {
    setOption();
  },
  { deep: true }
);

onMounted(() => {
  initChart();
  window.addEventListener("resize", resize);
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener("resize", resize);
});

// 暴露方法給父組件
defineExpose({
  resize,
  getInstance: () => chartInstance,
});
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>
