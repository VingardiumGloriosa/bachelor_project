<template>
  <v-container class="lift-card">
    <h3 class="table-title">Personal Records</h3>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Rep Scheme</th>
          <th class="text-left">Weight (kg)</th>
          <th class="text-left">Date Achieved</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in records" :key="record.pr_id">
          <td>{{ record.rep_scheme }}</td>
          <td>{{ record.weight }}</td>
          <td>{{ formatDate(record.achieved_on) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-btn class="pr-add">+ Add PR</v-btn>
  </v-container>
</template>
<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { type Exercise } from "../types/ProgrammeTypes";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";

const programmeStore = useProgrammeStore();
const userStore = useUserStore();

const props = defineProps<{
  selectedExercise: Exercise | null;
}>();

const records = ref([]);

watch(
  () => props.selectedExercise,
  async (newExercise) => {
    if (newExercise) {
      try {
        records.value = await programmeStore.fetchPersonalRecords(
          userStore.user.id,
          newExercise.exercise_id
        );
      } catch (error) {
        console.error("Failed to fetch personal records:", error);
      }
    } else {
      records.value = [];
    }
  },
  { immediate: true }
);

function formatDate(date: string | null): string {
  if (!date) return "Not Recorded";
  const d = new Date(date);
  return d.toLocaleDateString();
}
</script>

<style scoped>
.table-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
}

.v-table {
  background-color: var(--light-grey);
  color: white;
}

.lift-card {
  background-color: var(--light-grey);
  border-radius: 16px;
  padding-bottom: 1.5em;
}

.v-table th,
.v-table td {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.pr-add {
  background-color: white;
  color: black;
  border-radius: 16px;
  font-weight: 600;
  margin-top: 16px;
  text-transform: capitalize;
}
</style>
