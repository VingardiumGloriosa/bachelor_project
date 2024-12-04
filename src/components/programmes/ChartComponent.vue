<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance = null;

watch(
  () => props.records,
  (newRecords) => {
    if (chartInstance) {
      chartInstance.data.labels = newRecords.map((record) => record.date);
      chartInstance.data.datasets[0].data = newRecords.map(
        (record) => record.weight
      );
      chartInstance.update();
    }
  },
  { immediate: true }
);

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
.chart-container {
  margin-top: 16px;
}

canvas {
  width: 100%;
  height: 400px;
}
</style>
