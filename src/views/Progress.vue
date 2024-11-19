<template>
  <div class="home-container">
    <h1>Progress</h1>
    <!-- Assuming you're using V-Select from Vuetify -->
    <v-select
      label="Select Exercise"
      variant="underlined"
      :items="exercises"
      item-title="name"
      item-value="exercise_id"
    />
    <LiftCard />
    <HistoryList />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import LiftCard from "@/components/progress/LiftCard.vue";
import HistoryList from "@/components/progress/HistoryList.vue";
import { supabase } from "@/supabase/supabase";

const exercises = ref<any[]>([]);
const selectedExercise = ref<any>(null);

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
