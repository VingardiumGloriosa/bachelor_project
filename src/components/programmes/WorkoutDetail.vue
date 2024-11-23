<template>
  <v-container class="lift-card" v-if="workout && workout.workout_exercises">
    <h3 class="table-title">{{ workout.name }}</h3>
    <div
      v-for="workoutExercise in workout.workout_exercises"
      :key="workoutExercise.workout_exercise_id"
    >
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Reps</th>
            <th class="text-left">%</th>
            <th class="text-left">Weight (kg)</th>
            <th class="text-left">Success</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="set in workoutExercise.sets" :key="set.set_id">
            <td>{{ set.reps }}</td>
            <td>{{ set.percentage }}%</td>
            <td>
              <v-text-field
                v-model="set.weight"
                type="number"
                :placeholder="'Enter weight'"
                dense
                hide-details
              />
            </td>
            <td>
              <v-checkbox v-model="set.success" hide-details dense />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div class="button-container">
      <!-- Buttons to be implemented -->
      <v-btn class="btn-small" @click="addSet">+ Add Set</v-btn>
      <v-btn class="btn-small" @click="addComment">+ Add Comment</v-btn>
    </div>
  </v-container>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, watch } from "vue";
import { type Workout } from "@/components/types/ProgrammeTypes";

const emit = defineEmits(["updateWorkout"]);

const props = defineProps<{
  workout: Workout;
}>();

watch(
  () => props.workout,
  (newWorkout) => {
    emit("updateWorkout", newWorkout);
  },
  { deep: true }
);

// Function to add a new set
const addSet = () => {
  alert("Add your PR here...");
};

// Function to add a comment
const addComment = () => {
  alert("Add your comment here...");
};
</script>

<style scoped>
.table-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
}

.v-table {
  background-color: var(--light-grey);
  color: white;
}

.lift-card {
  background-color: var(--light-grey);
  border-radius: 16px;
  padding-bottom: 1.5em;
}

.v-table th,
.v-table td {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.v-text-field {
  width: 100px;
}

.v-checkbox {
  display: flex;
  justify-content: center;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
