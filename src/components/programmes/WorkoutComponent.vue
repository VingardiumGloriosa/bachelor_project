<template>
  <div class="workout">
    <v-text-field
      label="Workout Name"
      v-model="props.workout.name"
      placeholder="Enter workout name"
      dense
      class="mb-2"
    />
    <div
      v-for="(exercise, exerciseIndex) in workout.workout_exercises"
      :key="exerciseIndex"
      class="mb-4"
    >
      <ExerciseComponent
        :exercise="exercise"
        :exerciseIndex="exerciseIndex"
        :workoutIndex="props.workoutIndex"
        :exercises="exercises"
        @add-set="addSet"
        @remove-exercise="removeExercise"
        @remove-set="removeSet"
      />
    </div>
    <v-btn small @click="addExercise">+ Add Exercise</v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import ExerciseComponent from "./ExerciseComponent.vue";

const props = defineProps({
  workout: Object,
  workoutIndex: Number,
  exercises: Array,
});

const emit = defineEmits([
  "add-exercise",
  "remove-exercise",
  "add-set",
  "remove-set",
]);

const addExercise = () => {
  emit("add-exercise", props.workoutIndex);
};

const addSet = (exerciseIndex: number) => {
  emit("add-set", props.workoutIndex, exerciseIndex);
};

const removeExercise = (exerciseIndex: number) => {
  emit("remove-exercise", props.workoutIndex, exerciseIndex);
};

const removeSet = (exerciseIndex: number, setIndex: number) => {
  emit("remove-set", props.workoutIndex, exerciseIndex, setIndex);
};
</script>

<style scoped>
.workout {
  margin-bottom: 16px;
}
</style>
