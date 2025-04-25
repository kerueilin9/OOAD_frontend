import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "./style.css";
import { setupNaive } from "./plugins/naive";

const app = createApp(App);
setupNaive(app);
app.use(router);
app.mount("#app");
