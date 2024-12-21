<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import Chart from "chart.js/auto";
import {
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";

const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance = null;
const groupRecordsByTime = (records) => {
  if (records.length === 0) return { labels: [], data: [] };

  const firstValidRecord = records.find(
    (record) => record.date && !isNaN(new Date(record.date))
  );
  const lastValidRecord = records
    .slice()
    .reverse()
    .find((record) => record.date && !isNaN(new Date(record.date)));

  if (!firstValidRecord || !lastValidRecord) {
    console.error("No valid dates found in records.");
    return { labels: [], data: [] };
  }

  const firstDate = new Date(firstValidRecord.date);
  const lastDate = new Date(lastValidRecord.date);

  const daysDifference =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

  let grouping = "day";
  if (daysDifference > 365) {
    grouping = "year";
  } else if (daysDifference > 30) {
    grouping = "month";
  } else if (daysDifference > 7) {
    grouping = "week";
  }

  const grouped = {};
  records.forEach((record) => {
    if (!record.date || isNaN(new Date(record.date))) {
      console.warn("Skipping invalid record:", record);
      return;
    }

    const date = new Date(record.date);
    let groupKey;

    if (grouping === "year") {
      groupKey = format(startOfYear(date), "yyyy");
    } else if (grouping === "month") {
      groupKey = format(startOfMonth(date), "MMM yyyy");
    } else if (grouping === "week") {
      groupKey = format(startOfWeek(date), "MMM dd, yyyy");
    } else {
      groupKey = format(date, "MMM dd");
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(record.weight);
  });

  const labels = Object.keys(grouped);
  const data = labels.map((label) => {
    const weights = grouped[label];
    return Math.max(...weights);
  });

  return { labels, data };
};

const groupedData = computed(() => groupRecordsByTime(props.records));

watch(
  () => groupedData.value,
  ({ labels, data }) => {
    if (chartInstance) {
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = data;
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
        labels: groupedData.value.labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: groupedData.value.data,
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
              text: "Time",
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
