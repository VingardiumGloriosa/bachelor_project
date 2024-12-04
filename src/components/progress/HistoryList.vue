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

  <v-container class="lift-card">
    <div v-if="uniqueRepSchemes.includes(parseInt(activeFilter))">
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
          <tr v-for="(record, index) in filteredRecords" :key="index">
            <td>{{ record.date }}</td>
            <td>{{ record.weight }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineProps,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import Title from "../shared/TitleElement.vue";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import { type Exercise } from "../types/ProgrammeTypes";
import Chart from "chart.js/auto";

const userStore = useUserStore();
const programmeStore = useProgrammeStore();

const props = defineProps<{
  selectedExercise: Exercise | null;
}>();

const history = ref([]);

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
        console.error("Failed to fetch exercise history:", error);
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
};

const filteredRecords = computed(() => {
  return history.value
    .filter((record) => record.reps_completed === parseInt(activeFilter.value))
    .map((record) => ({
      date: new Date(record.created_at).toLocaleDateString(),
      weight: record.weight_used,
    }));
});

const uniqueRepSchemes = computed(() => {
  const reps = history.value.map((record) => record.reps_completed);
  return [...new Set(reps)];
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance = null;

watch(filteredRecords, (newRecords) => {
  if (chartInstance) {
    chartInstance.data.labels = newRecords.map((record) => record.date);
    chartInstance.data.datasets[0].data = newRecords.map(
      (record) => record.weight
    );
    chartInstance.update();
  }
});

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Weight (kg)",
            data: [],
            borderColor: "#0561e2",
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw} kg`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Weight (kg)",
            },
          },
        },
      },
    });
  }
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
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
</style>
