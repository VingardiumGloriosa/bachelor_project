import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue";
import router from "./router";
import "./assets/variables.css";

const app = createApp(App);
const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark",
  },
});
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
