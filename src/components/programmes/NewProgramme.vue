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
    <v-autocomplete
      v-if="userRole === 'Coach'"
      label="Team"
      v-model="programme.team_id"
      :items="programmeStore.teams"
      item-title="team_name"
      item-value="team_id"
      placeholder="Select team"
      dense
      class="mb-2"
    />
    <v-autocomplete
      v-if="userRole === 'Coach'"
      label="Programme Type"
      v-model="programme.type"
      :items="['official']"
      placeholder="Official"
      dense
      readonly
      class="mb-4"
    />
    <v-autocomplete
      v-else
      label="Programme Type"
      v-model="programme.type"
      :items="['personal']"
      placeholder="Personal"
      dense
      readonly
      class="mb-4"
    />
    <div
      v-for="(workout, workoutIndex) in programme.workouts"
      :key="workoutIndex"
    >
      <WorkoutComponent
        :workout="workout"
        :workoutIndex="workoutIndex"
        :exercises="programmeStore.exercises"
        @add-exercise="addExercise"
        @remove-exercise="removeExercise"
        @add-set="addSet"
        @remove-set="removeSet"
      />
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
import { reactive, onMounted, ref } from "vue";
import { type Programme } from "@/components/types/ProgrammeTypes";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "vue-router";
import { useToastStore, ToastType } from "@/stores/ToastStore";
import { validateProgramme } from "@/validation/validation";
import WorkoutComponent from "./WorkoutComponent.vue";

const programmeStore = useProgrammeStore();
const userStore = useUserStore();
const toastStore = useToastStore();
const router = useRouter();
const userRole = ref<string | null>(null);

const programme = reactive<Programme>({
  name: "",
  type: "",
  team_id: null,
  workouts: [],
});

onMounted(async () => {
  const role = await userStore.fetchUserRole(userStore.user?.id);
  userRole.value = role;

  if (role === "Coach") {
    programme.type = "official";
    programme.team_id = null;
  } else if (role === "Athlete") {
    programme.type = "personal";
    programme.team_id = null;
    delete programme.team_id;
  }

  programmeStore.fetchExercises();
  if (role === "Coach") {
    programmeStore.fetchTeams();
  }
});

const submitProgrammeHandler = async () => {
  try {
    if (userRole.value === "Athlete") {
      programme.team_id = null;
    }

    const validationErrors = validateProgramme(programme, userRole.value);
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
    router.push("/programmes");
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
</style>
