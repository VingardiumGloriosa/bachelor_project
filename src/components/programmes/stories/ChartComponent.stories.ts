import { type Meta, type StoryFn } from "@storybook/vue3";
import ChartComponent from "../ChartComponent.vue";

export default {
  title: "Components/ChartComponent",
  component: ChartComponent,
  argTypes: {
    records: {
      control: { type: "object" },
      description: "Array of records with date and weight properties.",
    },
  },
} as Meta<typeof ChartComponent>;

const Template: StoryFn<typeof ChartComponent> = (args) => ({
  components: { ChartComponent },
  setup() {
    return { args };
  },
  template: '<ChartComponent v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  records: [
    { date: "2024-01-01", weight: 70 },
    { date: "2024-01-02", weight: 72 },
    { date: "2024-01-05", weight: 74 },
    { date: "2024-01-10", weight: 76 },
    { date: "2024-02-01", weight: 78 },
    { date: "2024-03-01", weight: 80 },
    { date: "2024-04-01", weight: 82 },
    { date: "2024-05-01", weight: 84 },
  ],
};

export const WeeklyGrouping = Template.bind({});
WeeklyGrouping.args = {
  records: [
    { date: "2024-01-01", weight: 70 },
    { date: "2024-01-08", weight: 75 },
    { date: "2024-01-15", weight: 80 },
    { date: "2024-01-22", weight: 85 },
    { date: "2024-01-29", weight: 90 },
  ],
};

export const MonthlyGrouping = Template.bind({});
MonthlyGrouping.args = {
  records: [
    { date: "2024-01-01", weight: 70 },
    { date: "2024-02-01", weight: 75 },
    { date: "2024-03-01", weight: 80 },
    { date: "2024-04-01", weight: 85 },
    { date: "2024-05-01", weight: 90 },
  ],
};

export const NoData = Template.bind({});
NoData.args = {
  records: [],
};
