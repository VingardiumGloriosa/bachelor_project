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
    <LiftCard v-if="selectedExercise" :selectedExercise="selectedExercise" />
    <HistoryList v-if="selectedExercise" :selectedExercise="selectedExercise" />
    <ProgressGraph />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import LiftCard from "@/components/progress/LiftCard.vue";
import HistoryList from "@/components/progress/HistoryList.vue";
import { supabase } from "@/supabase/supabase";
import { type Exercise } from "@/components/types/ProgrammeTypes";
import ProgressGraph from "@/components/progress/ProgressGraph.vue";

const exercises = ref<Exercise[]>([]);
const selectedExerciseId = ref<string | null>(null);
const selectedExercise = ref<Exercise | null>(null);

watch(selectedExerciseId, async (newExerciseId) => {
  if (newExerciseId) {
    const exercise = exercises.value.find(
      (ex) => ex.exercise_id === newExerciseId
    );
    selectedExercise.value = exercise || null;
  }
});

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
</script>

<style scoped></style>
