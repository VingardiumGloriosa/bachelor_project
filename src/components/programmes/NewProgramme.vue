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
    <v-btn class="btn-submit mt-4" color="primary" @click="submitProgramme">
      Submit Programme
    </v-btn>
    <v-alert
      v-if="status"
      :type="status.includes('Error') ? 'error' : 'success'"
      class="mt-4"
    >
      {{ status }}
    </v-alert>
    <v-alert v-if="programmeId" type="info" class="mt-2">
      Programme ID: {{ programmeId }}
    </v-alert>
  </v-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { supabase } from "@/supabase/supabase";
//to be remade to use stores instead of a lot of shit in one file

const exercises = ref<any[]>([]);

onMounted(async () => {
  try {
    const { data, error } = await supabase.rpc("fetch_exercises");
    if (error) {
      console.error("Error fetching exercises:", error.message);
    } else {
      exercises.value = data || [];
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
});

interface Programme {
  name: string;
  type: string;
  workouts: Array<{
    name: string;
    workout_exercises: Array<{
      exercise_id: string;
      exercise_order: number;
      sets: Array<{
        reps: number | null;
        percentage: number | null;
      }>;
    }>;
  }>;
}

const programme = reactive<Programme>({
  name: "",
  type: "personal",
  workouts: [],
});

const programmeId = ref<string | null>(null);
const status = ref<string | null>(null);

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

const submitProgramme = async () => {
  try {
    console.log("Submitting programme:", JSON.stringify(programme, null, 2));
    const { data, error } = await supabase.rpc("create_programme", {
      programme_name: programme.name,
      programme_type: programme.type,
      user_uuid: "0aab1c6b-009e-40e0-b64b-a9f8a206b2aa",
      workouts: programme.workouts.map((workout) => ({
        ...workout,
        workout_exercises: workout.workout_exercises.map((exercise) => ({
          exercise_id: exercise.exercise_id,
          exercise_order: exercise.exercise_order,
          sets: exercise.sets,
        })),
      })),
    });

    if (error) {
      console.error("Error:", error.message);
      status.value = `Error: ${error.message}`;
    } else {
      status.value = data?.status || "Unknown status";
      programmeId.value = data?.programme_id || null;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    status.value = "Unexpected error occurred";
  }
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
