<template>
  <v-container class="lift-card">
    <h3 class="table-title">Snatch</h3>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Reps</th>
          <th class="text-left">Weight (kg)</th>
          <th class="text-left">Date Achieved</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in snatchRecords" :key="index">
          <td>{{ record.reps }}</td>
          <td>{{ record.weight }}</td>
          <td>{{ record.date }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-btn class="pr-add">+ Add PR</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const snatchRecords = ref([
  { reps: "1RM", weight: 120, date: "2023-11-01" },
  { reps: "2RM", weight: 115, date: "2023-10-15" },
  { reps: "3RM", weight: 110, date: "2023-09-30" },
  { reps: "5RM", weight: 100, date: "2023-08-20" },
]);
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
