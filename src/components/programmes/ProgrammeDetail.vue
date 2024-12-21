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
    <v-btn class="btn-tertiary mb-4" @click="null">Add comment</v-btn>
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
import { useToastStore, ToastType } from "@/stores/ToastStore";
import { useRouter } from "vue-router";
import WorkoutDetail from "@/components/programmes/WorkoutDetail.vue";
import Title from "@/components/shared/TitleElement.vue";
import {
  type Programme,
  type Workout,
  type WorkoutExercise,
  type Set,
} from "@/components/types/ProgrammeTypes";

const route = useRoute();
const programmeStore = useProgrammeStore();
const userStore = useUserStore();
const toastStore = useToastStore();
const router = useRouter();

const programme = ref<Programme>();
const programmeTitle = ref<string>("");
const workoutInputs = ref<Record<string, Workout>>({});

onMounted(async () => {
  const programmeId = route.params.id as string;
  programmeTitle.value = route.params.title as string;
  await fetchProgramme(programmeId);
});

const fetchProgramme = async (programmeId: string) => {
  const programmeData = await programmeStore.getProgrammeDetails(programmeId);
  programme.value = programmeData;

  programmeData.workouts.forEach((workout: Workout) => {
    workoutInputs.value[workout.workout_id] = {
      workout_id: workout.workout_id,
      name: workout.name,
      workout_exercises: [],
    };
  });
};

const updateWorkout = (workoutId: string, updatedData: Workout) => {
  workoutInputs.value[workoutId] = updatedData;
};

const finishProgramme = async () => {
  const workouts = Object.values(workoutInputs.value);
  workouts.forEach((workout) => {
    workout.workout_exercises.forEach((exercise: WorkoutExercise) => {
      exercise.sets.forEach((set: Set) => {
        if (set.success === undefined) {
          set.success = false;
        }
      });
    });
  });

  try {
    const response = await programmeStore.submitSet(
      workouts,
      userStore.user.id
    );

    if (response.status === "Success") {
      toastStore.toast("Programme finished successfully!", ToastType.SUCCESS);

      response.achievedPRs.forEach((pr) => {
        toastStore.toast(
          `New PR achieved for ${pr.exercise}: ${pr.weight} kg!`,
          ToastType.SUCCESS
        );
      });

      router.push("/programmes");
    } else {
      toastStore.toast(
        "An error occurred while finishing the programme.",
        ToastType.ERROR
      );
    }
  } catch (err) {
    console.error("Error finishing programme:", err);
    toastStore.toast(
      "An error occurred while finishing the programme.",
      ToastType.ERROR
    );
  }
};
</script>
<style scoped>
.v-btn {
  width: 100%;
}
</style>
