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
      {{ option }}
    </v-chip>
  </div>

  <v-container class="lift-card">
    <div v-if="uniqueRepSchemes.includes(activeFilter)">
      <h3 class="table-title">Snatch - {{ activeFilter }}</h3>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Date Achieved</th>
            <th class="text-left">Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in filteredRecords(activeFilter)"
            :key="index"
          >
            <td>{{ record.date }}</td>
            <td>{{ record.weight }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Title from "../shared/Title.vue";

const snatchRecords = ref([
  { reps: "1RM", weight: 120, date: "2023-11-01" },
  { reps: "2RM", weight: 115, date: "2023-10-15" },
  { reps: "3RM", weight: 110, date: "2023-09-30" },
  { reps: "5RM", weight: 100, date: "2023-08-20" },
]);

const activeFilter = ref("1RM");

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const filteredRecords = (reps) => {
  return snatchRecords.value.filter((record) => record.reps === reps);
};

const uniqueRepSchemes = computed(() => {
  const reps = snatchRecords.value.map((record) => record.reps);
  return [...new Set(reps)];
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

.v-table th,
.v-table td {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}
</style>
