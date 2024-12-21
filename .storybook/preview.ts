import type { Preview } from "@storybook/vue3";
import "../src/assets/variables.css";
import { setup } from "@storybook/vue3";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify();

setup((app) => {
  app.use(vuetify);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
