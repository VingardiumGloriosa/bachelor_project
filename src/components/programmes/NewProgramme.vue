<template>
  <v-container class="lift-card">
    <h3 class="table-title">Create New Programme</h3>
    <v-text-field
      label="Programme Name"
      v-model="programme.name"
      placeholder="Enter programme name"
      dense
      class="mb-4"
    />
    <v-select
      label="Programme Type"
      v-model="programme.type"
      :items="['personal', 'official']"
      placeholder="Select type"
      dense
      class="mb-4"
    />
    <div
      v-for="(workout, workoutIndex) in programme.workouts"
      :key="workoutIndex"
      class="mb-4"
    >
      <v-text-field
        label="Workout Name"
        v-model="workout.name"
        placeholder="Enter workout name"
        dense
        class="mb-2"
      />
      <div
        v-for="(exercise, exerciseIndex) in workout.workout_exercises"
        :key="exerciseIndex"
        class="mb-4"
      >
        <v-select
          label="Exercise"
          v-model="exercise.exercise_id"
          :items="programmeStore.exercises"
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
                <v-btn
                  icon
                  @click="removeSet(workoutIndex, exerciseIndex, setIndex)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn small @click="addSet(workoutIndex, exerciseIndex)"
          >+ Add Set</v-btn
        >
      </div>
      <v-btn small @click="addExercise(workoutIndex)" class="mt-2"
        >+ Add Exercise</v-btn
      >
    </div>
    <v-btn small @click="addWorkout" class="mb-4">+ Add Workout</v-btn>
    <v-btn
      class="btn-submit mt-4"
      color="primary"
      @click="submitProgrammeHandler"
    >
      Submit Programme
    </v-btn>
  </v-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { type Programme } from "@/components/types/ProgrammeTypes";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import router from "@/router";
import { useToastStore, ToastType } from "@/stores/ToastStore";

/*
TO ADD
You should not be able to add a programme without a title
You should not be able to add a workout without a title
You should not be able to add an exercise without adding reps and sets to it
Styling
*/

const programmeStore = useProgrammeStore();
const userStore = useUserStore();
const toastStore = useToastStore();

onMounted(async () => {
  programmeStore.fetchExercises();
});

const programme = reactive<Programme>({
  name: "",
  type: "personal",
  workouts: [],
});

const validateProgramme = (programme: Programme): string[] => {
  const errors: string[] = [];

  if (!programme.name.trim()) {
    errors.push("Programme must have a name.");
  }

  if (programme.workouts.length === 0) {
    errors.push("Programme must have at least one workout.");
  } else {
    programme.workouts.forEach((workout, workoutIndex) => {
      if (!workout.name.trim()) {
        errors.push(`Workout ${workoutIndex + 1} must have a name.`);
      }

      if (workout.workout_exercises.length === 0) {
        errors.push(
          `Workout ${workoutIndex + 1} must have at least one exercise.`
        );
      } else {
        workout.workout_exercises.forEach((exercise, exerciseIndex) => {
          if (!exercise.exercise_id) {
            errors.push(
              `Exercise ${exerciseIndex + 1} in Workout ${
                workoutIndex + 1
              } must be selected.`
            );
          }

          if (exercise.sets.length === 0) {
            errors.push(
              `Exercise ${exerciseIndex + 1} in Workout ${
                workoutIndex + 1
              } must have at least one set.`
            );
          } else {
            exercise.sets.forEach((set, setIndex) => {
              if (set.reps === null || set.reps <= 0) {
                errors.push(
                  `Set ${setIndex + 1} in Exercise ${
                    exerciseIndex + 1
                  } in Workout ${
                    workoutIndex + 1
                  } must have a valid number of reps.`
                );
              }
              if (set.percentage === null || set.percentage <= 0) {
                errors.push(
                  `Set ${setIndex + 1} in Exercise ${
                    exerciseIndex + 1
                  } in Workout ${
                    workoutIndex + 1
                  } must have a valid percentage.`
                );
              }
            });
          }
        });
      }
    });
  }

  return errors;
};

const submitProgrammeHandler = async () => {
  try {
    const validationErrors = validateProgramme(programme);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toastStore.toast(error, ToastType.ERROR);
      });
      return;
    }

    await programmeStore.submitProgramme(
      programme,
      userStore.user?.id as string
    );
    toastStore.toast("Programme submitted successfully!", ToastType.SUCCESS);
    router.push({ name: "home" });
  } catch (err) {
    console.error("Unexpected error:", err);
    toastStore.toast("Unexpected error occurred.", ToastType.ERROR);
  }
};

const addWorkout = () => {
  programme.workouts.push({
    name: "",
    workout_exercises: [],
  });
};

const addExercise = (workoutIndex: number) => {
  const currentExercises = programme.workouts[workoutIndex].workout_exercises;
  const newOrder = currentExercises.length + 1;
  programme.workouts[workoutIndex].workout_exercises.push({
    exercise_id: null,
    exercise_order: newOrder,
    sets: [],
  });
};

const addSet = (workoutIndex: number, exerciseIndex: number) => {
  programme.workouts[workoutIndex].workout_exercises[exerciseIndex].sets.push({
    reps: null,
    percentage: null,
  });
};

const removeSet = (
  workoutIndex: number,
  exerciseIndex: number,
  setIndex: number
) => {
  programme.workouts[workoutIndex].workout_exercises[exerciseIndex].sets.splice(
    setIndex,
    1
  );
};

const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
  const workout = programme.workouts[workoutIndex];
  workout.workout_exercises.splice(exerciseIndex, 1);
  workout.workout_exercises.forEach((exercise, index) => {
    exercise.exercise_order = index + 1;
  });
};
</script>
<style scoped>
.table-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
}

.lift-card {
  background-color: var(--light-grey);
  border-radius: 16px;
  padding: 20px;
}

.v-table th,
.v-table td {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.v-btn.small {
  font-size: 12px;
}

.v-btn {
  margin-right: 8px;
}
</style>
