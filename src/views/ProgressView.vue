<template>
  <div class="home-container">
    <h1>Progress</h1>
    <v-autocomplete
      label="Select Exercise"
      variant="underlined"
      :items="exercises"
      item-title="name"
      item-value="exercise_id"
      v-model="selectedExerciseId"
    />
    <LiftCard
      v-if="selectedExercise"
      :key="selectedExercise?.exercise_id"
      :selectedExercise="selectedExercise"
    />
    <HistoryList
      v-if="selectedExercise"
      :key="selectedExercise?.exercise_id"
      :selectedExercise="selectedExercise"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import LiftCard from "@/components/progress/LiftCard.vue";
import HistoryList from "@/components/progress/HistoryList.vue";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import { type Exercise } from "@/components/types/ProgrammeTypes";

const programmeStore = useProgrammeStore();
const userStore = useUserStore();

const exercises = ref<Exercise[]>([]);
const selectedExerciseId = ref<string | null>(null);
const selectedExercise = ref<Exercise | null>(null);
const personalRecords = ref([]);

onMounted(async () => {
  try {
    await programmeStore.fetchExercises();
    exercises.value = programmeStore.exercises;
  } catch (err) {
    console.error("Error fetching exercises:", err);
  }
});

watch(selectedExerciseId, async (newExerciseId) => {
  if (newExerciseId) {
    const exercise = exercises.value.find(
      (ex) => ex.exercise_id === newExerciseId
    );
    selectedExercise.value = exercise || null;

    if (selectedExercise.value) {
      try {
        personalRecords.value = await programmeStore.fetchPersonalRecords(
          selectedExercise.value.exercise_id,
          userStore.user.id
        );
      } catch (err) {
        console.error("Error fetching PRs:", err);
      }
    }
  }
});
</script>
