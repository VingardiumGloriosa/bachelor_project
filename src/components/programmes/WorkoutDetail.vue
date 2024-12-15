<template>
  <v-container v-if="workout && workout.workout_exercises">
    <v-row>
      <v-col
        v-for="workoutExercise in workout.workout_exercises"
        :key="workoutExercise.workout_exercise_id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="lift-card">
          <v-card-title>{{ workoutExercise.exercise }}</v-card-title>
          <div class="table-wrapper">
            <table class="responsive-table">
              <thead>
                <tr>
                  <th>Reps</th>
                  <th>%</th>
                  <th>Weight (kg)</th>
                  <th>Success</th>
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
            </table>
          </div>
        </v-card>
      </v-col>
    </v-row>
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
</script>
<style scoped>
.lift-card {
  background-color: var(--light-grey);
  padding-bottom: 1.5em;
  border-radius: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
}

.responsive-table th,
.responsive-table td {
  text-align: left;
  padding: 8px;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  background-color: var(--light-grey);
  color: white;
}

@media (max-width: 600px) {
  .responsive-tabfle th,
  .responsive-table td {
    padding: 4px;
    font-size: 12px;
  }

  .lift-card {
    padding: 0.8em;
  }

  .v-text-field {
    width: 80px;
  }

  .v-checkbox {
    transform: scale(0.8);
  }
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

.v-card-title {
  color: white;
}
</style>
