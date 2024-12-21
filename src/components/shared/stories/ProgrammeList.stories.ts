import { type Meta, type StoryFn } from "@storybook/vue3";
import ProgrammeCard from "@/components/shared/ProgrammeCard.vue";

export default {
  title: "Components/ProgrammeCard",
  component: ProgrammeCard,
  argTypes: {
    date: {
      control: { type: "text" },
      description: "The ISO string representation of the date to display.",
    },
  },
} as Meta<typeof ProgrammeCard>;

const Template: StoryFn<typeof ProgrammeCard> = (args) => ({
  components: { ProgrammeCard },
  setup() {
    return { args };
  },
  template: '<ProgrammeCard v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  date: "2024-12-25",
};

export const InvalidDate = Template.bind({});
InvalidDate.args = {
  date: "Invalid Date String",
};

export const CustomDate = Template.bind({});
CustomDate.args = {
  date: "2023-07-04",
};
