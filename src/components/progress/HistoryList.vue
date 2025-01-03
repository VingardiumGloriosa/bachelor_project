<template>
  <Title title="History" />
  <div id="filter-chips">
    <v-chip
      v-for="option in uniqueRepSchemes"
      :key="option"
      :class="{ active: activeFilter === option }"
      @click="setFilter(option)"
      class="chip"
    >
      {{ option }} Reps
    </v-chip>
  </div>
  <v-container class="lift-card mb-6">
    <div v-if="visibleRecords.length > 0">
      <h3 class="table-title">
        {{ props.selectedExercise?.name }} - {{ activeFilter }}RM
      </h3>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Date Achieved</th>
            <th class="text-left">Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in visibleRecords" :key="index">
            <td>{{ record.date }}</td>
            <td>{{ record.weight }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="see-more-container">
        <v-btn
          v-if="showSeeMoreButton"
          variant="text"
          color="primary"
          @click="loadMore"
        >
          See More
        </v-btn>
      </div>
      <ChartComponent :records="filteredRecords" />
    </div>
    <div v-else>
      <p class="text-center">No history available.</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, watch } from "vue";
import Title from "../shared/TitleElement.vue";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import { type Exercise } from "../types/ProgrammeTypes";
import ChartComponent from "../programmes/ChartComponent.vue";

const userStore = useUserStore();
const programmeStore = useProgrammeStore();

const props = defineProps<{
  selectedExercise: Exercise | null;
}>();

const history = ref([]);
const visibleCount = ref(5);

watch(
  () => props.selectedExercise,
  async (newExercise) => {
    if (newExercise) {
      try {
        history.value = await programmeStore.fetchExerciseHistory(
          userStore.user.id,
          newExercise.exercise_id
        );
      } catch (error) {
        history.value = [];
      }
    } else {
      history.value = [];
    }
  },
  { immediate: true }
);

const activeFilter = ref("");
const setFilter = (filter) => {
  activeFilter.value = filter;
  visibleCount.value = 5;
};

const filteredRecords = computed(() => {
  if (history.value && history.value.length > 0) {
    const filtered = history.value
      .filter((record) => {
        return (
          activeFilter && record.reps_completed === parseInt(activeFilter.value)
        );
      })
      .map((record) => ({
        date: new Date(record.created_at).toLocaleDateString(),
        weight: record.weight_used,
      }));
    return filtered;
  } else {
    return [];
  }
});

const visibleRecords = computed(() => {
  return filteredRecords.value.slice(0, visibleCount.value);
});

const showSeeMoreButton = computed(() => {
  return visibleCount.value < filteredRecords.value.length;
});

const loadMore = () => {
  visibleCount.value += 5;
};

const uniqueRepSchemes = computed(() => {
  if (history.value && history.value.length > 0) {
    const reps = history.value.map((record) => record.reps_completed);
    const uniqueReps = [...new Set(reps)].sort((a, b) => a - b);
    return uniqueReps;
  } else {
    return [];
  }
});
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

.chart-container {
  margin-top: 16px;
}

canvas {
  width: 100%;
  height: 400px;
}

.v-table th,
.v-table td {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.see-more-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
