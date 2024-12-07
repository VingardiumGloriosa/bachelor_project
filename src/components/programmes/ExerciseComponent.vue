<template>
  <div class="exercise">
    <v-autocomplete
      label="Exercise"
      v-model="props.exercise.exercise_id"
      :items="exercises"
      item-title="name"
      item-value="exercise_id"
      placeholder="Select exercise"
      dense
      class="mb-2"
    />
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Reps</th>
          <th class="text-left">%</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(set, setIndex) in exercise.sets" :key="setIndex">
          <td>
            <v-text-field
              v-model="set.reps"
              type="number"
              placeholder="Reps"
              dense
              hide-details
            />
          </td>
          <td>
            <v-text-field
              v-model="set.percentage"
              type="number"
              placeholder="%"
              dense
              hide-details
            />
          </td>
          <td>
            <v-btn icon @click="removeSet(setIndex)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-btn small @click="addSet">+ Add Set</v-btn>
    <v-btn small color="error" class="mt-2" @click="removeExercise">
      Remove Exercise
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  exercise: Object,
  workoutIndex: Number,
  exerciseIndex: Number,
  exercises: Array,
});

const emit = defineEmits(["add-set", "remove-exercise", "remove-set"]);

const addSet = () => {
  emit("add-set", props.workoutIndex, props.exerciseIndex);
};

const removeExercise = () => {
  emit("remove-exercise", props.workoutIndex, props.exerciseIndex);
};

const removeSet = (setIndex: number) => {
  emit("remove-set", props.workoutIndex, props.exerciseIndex, setIndex);
};
</script>

<style scoped>
.exercise {
  margin-bottom: 16px;
}
</style>
