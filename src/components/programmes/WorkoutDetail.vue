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
                      :placeholder="
                        getPRPlaceholder(
                          workoutExercise.exercise_id,
                          set.percentage
                        )
                      "
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
import { ref, watch, defineProps, defineEmits } from "vue";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import type { Workout } from "@/components/types/ProgrammeTypes";

const props = defineProps<{
  workout: Workout;
}>();

const programmeStore = useProgrammeStore();
const userStore = useUserStore();
const workoutPRs = ref([]);

const emit = defineEmits(["updateWorkout"]);

const fetchWorkoutPRs = async () => {
  try {
    const userId = userStore.user?.id;
    if (props.workout && props.workout.workout_exercises) {
      const prs = [];
      for (const exercise of props.workout.workout_exercises) {
        const pr = await programmeStore.fetchPersonalRecord(
          userId,
          exercise.exercise_id,
          "1"
        );
        if (pr) {
          prs.push(pr);
        }
      }
      workoutPRs.value = prs;
    }
  } catch (error) {
    console.error("Error fetching single-lift PRs:", error);
  }
};

const getPRPlaceholder = (exerciseId, percentage) => {
  const matchingPR = workoutPRs.value
    .flat()
    .find((pr) => pr.exercise_id === exerciseId);
  if (matchingPR) {
    const prWeight = matchingPR.weight;
    const calculatedWeight = (prWeight * percentage) / 100;
    return calculatedWeight.toFixed(2);
  }

  return "Enter weight";
};

watch(
  () => props.workout,
  async (newWorkout) => {
    if (newWorkout) {
      await fetchWorkoutPRs();
    }
  },
  { immediate: true, deep: true }
);

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
  .responsive-table th,
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

.v-card-title {
  color: white;
}
</style>
