<template>
  <v-container v-if="programme">
    <Title :title="programmeTitle" class="mb-4" />
    <WorkoutDetail
      v-for="workout in programme.workouts"
      :key="workout.workout_id"
      :workout="workout"
      class="mb-4"
    />
    <!-- This button still overflows -->
    <v-btn class="btn-primary mb-4">Finish Workout</v-btn>
  </v-container>

  <v-container v-else>
    <p>Loading...</p>
  </v-container>
</template>

<script setup lang="ts">
/*
Missing 
Only usses workout name but not wokrout exercise name
*/
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import WorkoutDetail from "@/components/programmes/WorkoutDetail.vue";
import Title from "@/components/shared/Title.vue";

const route = useRoute();
const programmeStore = useProgrammeStore();

//to be fixed
const programme = ref<Programme | null>(null);
const programmeTitle = ref<string>("");

onMounted(async () => {
  const programmeId = route.params.id as string;
  programmeTitle.value = route.params.title as string;
  await fetchProgramme(programmeId);
});

const fetchProgramme = async (programmeId: string) => {
  const programmeData = await programmeStore.getProgrammeDetails(programmeId);
  programme.value = programmeData;
};
</script>
