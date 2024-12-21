import { type Meta, type StoryFn } from "@storybook/vue3";
import LiftCard from "@/components/progress/LiftCard.vue";
import type { Exercise } from "@/components/types/ProgrammeTypes";

export default {
  title: "Components/LiftCard",
  component: LiftCard,
  argTypes: {
    selectedExercise: {
      control: "object",
      description:
        "The selected exercise whose personal records are displayed.",
    },
    records: {
      control: "object",
      description: "The personal records for the selected exercise.",
    },
  },
} as Meta<typeof LiftCard>;

const Template: StoryFn<typeof LiftCard> = (args) => ({
  components: { LiftCard },
  setup() {
    return { args };
  },
  template: '<LiftCard v-bind="args" />',
});

export const Empty = Template.bind({});
Empty.args = {
  selectedExercise: {
    exercise_id: "exercise2",
    name: "Squat",
  } as Exercise,
  records: [],
};
