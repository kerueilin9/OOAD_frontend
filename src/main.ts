import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "./style.css";
import { setupNaive } from "./plugins/naive";
import { setupECharts } from "./plugins/echarts";

const app = createApp(App);
setupNaive(app);
setupECharts(app);
app.use(router);
app.mount("#app");
