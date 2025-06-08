import type { App } from "vue";
import * as echarts from "echarts/core";
// 引入圖表类型
import { BarChart, PieChart, LineChart } from "echarts/charts";
// 引入必要的組件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
} from "echarts/components";
// 引入特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入渲染器
import { CanvasRenderer } from "echarts/renderers";

// 註冊所需的組件和圖表
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  PieChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export function setupECharts(app: App) {
  app.config.globalProperties.$echarts = echarts;
}

export { echarts };

export function useECharts() {
  return echarts;
}
