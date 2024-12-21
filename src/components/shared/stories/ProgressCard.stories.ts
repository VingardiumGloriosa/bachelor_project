import { type Meta, type StoryFn } from "@storybook/vue3";
import ProgressCard from "../ProgressCard.vue";

export default {
  title: "Components/ProgressCard",
  component: ProgressCard,
  argTypes: {
    goalWeight: {
      control: { type: "number" },
      description: "The target weight for the exercise",
    },
    currentWeight: {
      control: { type: "number" },
      description: "The current weight achieved",
    },
    exerciseName: {
      control: { type: "text" },
      description: "The name of the exercise",
    },
  },
} as Meta<typeof ProgressCard>;

const Template: StoryFn<typeof ProgressCard> = (args) => ({
  components: { ProgressCard },
  setup() {
    return { args };
  },
  template: '<ProgressCard v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  goalWeight: 100,
  currentWeight: 80,
  exerciseName: "Snatch",
};

export const AlmostThere = Template.bind({});
AlmostThere.args = {
  goalWeight: 100,
  currentWeight: 95,
  exerciseName: "Clean & Jerk",
};

export const StartingOut = Template.bind({});
StartingOut.args = {
  goalWeight: 100,
  currentWeight: 20,
  exerciseName: "Squat",
};
