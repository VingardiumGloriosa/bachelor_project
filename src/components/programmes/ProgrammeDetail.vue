<template>
  <v-container v-if="programme">
    <WorkoutDetail
      v-for="workout in programme.workouts"
      :key="workout.workout_id"
      :workout="workout"
      class="mb-4"
    />
    <v-btn class="btn-primary mb-4">Finish Workout</v-btn>
  </v-container>

  <v-container v-else>
    <p>Loading...</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProgrammeStore } from "@/stores/programmeStore";
import WorkoutDetail from "@/components/programmes/WorkoutDetail.vue";

const route = useRoute();
const programmeStore = useProgrammeStore();

const programme = ref<Programme | null>(null);

onMounted(async () => {
  const programmeId = route.params.id as string;
  await fetchProgramme(programmeId);
});

const fetchProgramme = async (programmeId: string) => {
  const programmeData = await programmeStore.getProgrammeDetails(programmeId);
  programme.value = programmeData;
};
</script>
