<template>
  <div class="back">
    <v-container class="lift-card">
      <h3 class="table-title">Create New Programme</h3>
      <v-text-field
        v-if="userRole === 'Athlete'"
        label="Programme Name"
        v-model="programme.name"
        placeholder="Enter programme name"
        dense
      />
      <div v-if="userRole === 'Coach'">
        <date-picker @updateName="updateProgrammeName"></date-picker>
      </div>
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
          <v-autocomplete
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
          <div class="btn-group mt-2">
            <v-btn
              class="btn-tertiary"
              @click="addSet(workoutIndex, exerciseIndex)"
            >
              + Add Set
            </v-btn>
            <v-btn
              class="btn-alert"
              @click="removeExercise(workoutIndex, exerciseIndex)"
            >
              Remove Exercise
            </v-btn>
          </div>
        </div>
        <v-btn
          class="btn-tertiary mt-2 full"
          @click="addExercise(workoutIndex)"
        >
          + Add Exercise
        </v-btn>
      </div>
      <v-btn @click="addWorkout" class="btn-tertiary mt-2 full"
        >+ Add Workout</v-btn
      >
      <v-btn class="btn-primary mt-2 full" @click="submitProgrammeHandler">
        Submit Programme
      </v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { type Programme } from "@/components/types/ProgrammeTypes";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "vue-router";
import { useToastStore, ToastType } from "@/stores/ToastStore";
import { validateProgramme } from "@/validation/validation";
import DatePicker from "@/components/shared/DatePicker.vue";

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

const updateProgrammeName = (date: string) => {
  console.log(date);
  programme.name = date;
};

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

.v-table th,
.v-table td {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.btn-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.back {
  margin: 2%;
}

.full {
  width: 100%;
}
</style>
