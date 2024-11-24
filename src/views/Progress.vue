<template>
  <div class="home-container">
    <h1>Progress</h1>
    <v-autocomplete
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
import { type Exercise } from "@/components/types/ProgrammeTypes";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";

const programmeStore = useProgrammeStore();
const userStore = useUserStore();
const exercises = ref<Exercise[]>([]);

console.log(
  programmeStore.fetchPersonalRecords(
    userStore.user.id,
    "2eebe1a6-8c1a-4457-8b6b-cffc94fd530e",
    "5"
  )
);

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
