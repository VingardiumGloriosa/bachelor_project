<template>
  <v-container>
    <v-slide-group class="carousel" v-model="selected">
      <v-slide-item
        v-for="(goal, index) in userGoals"
        :key="goal.goal_id"
        class="carousel-item"
      >
        <ProgressCard
          :goalWeight="goal.goal_weight"
          :currentWeight="getCurrentPR(goal.exercise_id)"
          :exerciseName="getExerciseName(goal.exercise_id)"
        />
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProgressCard from "@/components/shared/ProgressCard.vue";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import {
  type Exercise,
  type Goal,
  type PR,
} from "@/components/types/ProgrammeTypes";

const programmeStore = useProgrammeStore();
const userStore = useUserStore();

const userGoals = ref<Goal[]>([]);
const userPRs = ref<PR[]>([]);
const exercises = ref<Exercise[]>([]);
const selected = ref(0);

onMounted(async () => {
  await userStore.loadUser();
  if (userStore.user) {
    const userId = userStore.user.id;

    userGoals.value = await programmeStore.fetchUserGoals(userId);
    userPRs.value = await programmeStore.fetchUserPRs(userId);
    exercises.value = await programmeStore.fetchExercises();
  }
});

const getCurrentPR = (exerciseId: string) => {
  const pr = userPRs.value.find((pr) => pr.exercise_id === exerciseId);
  return pr ? pr.weight : 0;
};

const getExerciseName = (exerciseId: string) => {
  const exercise = exercises.value.find(
    (exercise) => exercise.exercise_id === exerciseId
  );
  return exercise ? exercise.name : "Unknown Exercise";
};
</script>

<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.v-container {
  padding: 0;
  margin: 0;
}

::v-deep .v-slide-group__content {
  gap: 10px !important;
}
</style>
