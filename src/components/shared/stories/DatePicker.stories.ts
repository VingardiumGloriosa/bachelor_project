import { type Meta, type StoryFn } from "@storybook/vue3";
import DatePicker from "@/components/shared/DatePicker.vue";

export default {
  title: "Components/DatePicker",
  component: DatePicker,
  argTypes: {
    minDate: {
      control: { type: "date" },
      description: "Minimum selectable date",
    },
    menuVisible: {
      control: { type: "boolean" },
      description: "Visibility of the date picker menu",
    },
    selectedDate: {
      control: { type: "date" },
      description: "The currently selected date",
    },
    formattedDate: {
      control: { type: "text" },
      description: "The formatted date as displayed in the input",
    },
  },
} as Meta<typeof DatePicker>;

const Template: StoryFn<typeof DatePicker> = (args, { argTypes }) => ({
  components: { DatePicker },
  props: Object.keys(argTypes),
  template: '<DatePicker v-bind="$props" @updateName="updateNameHandler" />',
  methods: {
    updateNameHandler(date: string) {
      console.log("Selected date:", date);
    },
  },
});

export const Default = Template.bind({});
Default.args = {
  minDate: new Date().toISOString().substr(0, 10),
};

export const CustomMinDate = Template.bind({});
CustomMinDate.args = {
  minDate: "2024-01-01",
};
