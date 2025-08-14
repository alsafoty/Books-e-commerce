import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./scss/custom.scss";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap";
import "@fontsource/el-messiri"; // Defaults to weight 400
import "@fontsource/el-messiri/500.css"; // Medium weight
import "@fontsource/el-messiri/600.css"; // SemiBold weight
import "@fontsource/el-messiri/700.css"; // Bold weight
import "@fontsource-variable/noto-kufi-arabic"; // Variable font

window.bootstrap = bootstrap;
createApp(App).use(router).mount("#app");
