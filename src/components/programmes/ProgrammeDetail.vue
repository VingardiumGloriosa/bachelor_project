<template>
  <v-container v-if="programme">
    <Title :title="programmeTitle" class="mb-4" />
    <WorkoutDetail
      v-for="workout in programme.workouts"
      :key="workout.workout_id"
      :workout="workout"
      class="mb-4"
      @updateWorkout="updateWorkout(workout.workout_id, $event)"
    />
    <v-btn class="btn-primary mb-4" @click="finishProgramme"
      >Finish Workout</v-btn
    >
  </v-container>

  <v-container v-else>
    <p>Loading...</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import WorkoutDetail from "@/components/programmes/WorkoutDetail.vue";
import Title from "@/components/shared/Title.vue";
import {
  type Programme,
  type Workout,
} from "@/components/types/ProgrammeTypes";

const route = useRoute();
const programmeStore = useProgrammeStore();
const userStore = useUserStore();

const programme = ref<Programme | null>(null);
const programmeTitle = ref<string>("");
const workoutInputs = ref<Record<string, any>>({});

onMounted(async () => {
  const programmeId = route.params.id as string;
  programmeTitle.value = route.params.title as string;
  await fetchProgramme(programmeId);
});

const fetchProgramme = async (programmeId: string) => {
  const programmeData = await programmeStore.getProgrammeDetails(programmeId);
  programme.value = programmeData;

  programmeData.workouts.forEach((workout: Workout) => {
    workoutInputs.value[workout.workout_id] = [];
  });
};

const updateWorkout = (workoutId: string, updatedData: any) => {
  workoutInputs.value[workoutId] = updatedData;
};

const finishProgramme = () => {
  const workouts = Object.values(workoutInputs.value);
  const errors: string[] = [];

  workouts.forEach((workoutDetail: any) => {
    if (!Array.isArray(workoutDetail.workout_exercises)) {
      errors.push(`Workout "${workoutDetail.name}" is missing exercises.`);
      return;
    }

    workoutDetail.workout_exercises.forEach((exercise: any) => {
      exercise.sets.forEach((set: any) => {
        if (set.success === undefined) {
          set.success = false;
        }

        if (!set.weight || isNaN(Number(set.weight))) {
          errors.push(
            `Set ${set.set_id} in workout "${workoutDetail.name}" (exercise: "${exercise.exercise}") is missing a valid weight.`
          );
        }
      });
    });
  });

  if (errors.length > 0) {
    console.error("Validation errors:", errors);
    alert(`Please fix the following issues:\n${errors.join("\n")}`);
    return;
  }
  programmeStore.submitSet(workouts, userStore.user.id);
};
</script>
