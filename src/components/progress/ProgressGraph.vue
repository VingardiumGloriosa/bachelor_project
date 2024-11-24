<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto"; // Auto import everything from Chart.js

export default defineComponent({
  name: "ChartExample",
  setup() {
    // Reference to the canvas element where the chart will be drawn
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    // Create the chart when the component is mounted
    onMounted(() => {
      if (chartCanvas.value) {
        chartInstance = new Chart(chartCanvas.value, {
          type: "line", // Type of the chart (can be 'bar', 'line', 'pie', etc.)
          data: {
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
            ],
            datasets: [
              {
                label: "My First Dataset",
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: "rgb(75, 192, 192)", // Color of the line
                fill: false, // Set to `true` if you want the area under the line to be filled
                tension: 0.1, // Curvature of the line
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top", // Legend at the top
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.dataset.label}: ${context.raw} kg`; // Custom tooltip text
                  },
                },
              },
            },
          },
        });
      }
    });

    // Clean up chart instance when the component is destroyed
    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy(); // Clean up the chart to avoid memory leaks
      }
    });

    return {
      chartCanvas, // Make the canvas reference available in the template
    };
  },
});
</script>

<style scoped>
/* Optionally style the chart container */
canvas {
  width: 100%; /* Responsive canvas */
  height: 400px; /* Custom height for the chart */
}
</style>
