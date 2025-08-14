import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./scss/custom.scss";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap";

window.bootstrap = bootstrap;
createApp(App).use(router).mount("#app");
