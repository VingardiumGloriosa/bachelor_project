<template>
  <v-container class="lift-card">
    <h3 class="table-title">Snatch</h3>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Reps</th>
          <th class="text-left">%</th>
          <th class="text-left">Weight (kg)</th>
          <th class="text-left">Success</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in snatchRecords" :key="index">
          <td>{{ record.reps }}</td>
          <td>{{ record.percentage }}%</td>
          <td>
            <v-text-field
              v-model="record.weight"
              type="number"
              :placeholder="record.weight"
              dense
              hide-details
            />
          </td>
          <td>
            <v-checkbox v-model="record.success" hide-details dense />
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="button-container">
      <v-btn class="btn-add">+ Add Set</v-btn>
      <v-btn class="btn-add">+ Add Comment</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const snatchRecords = ref([
  { reps: "1RM", weight: 120, percentage: 100, success: true },
  { reps: "2RM", weight: 115, percentage: 95, success: true },
  { reps: "3RM", weight: 110, percentage: 90, success: false },
  { reps: "5RM", weight: 100, percentage: 85, success: true },
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

.btn-add {
  background-color: white;
  color: black;
  border-radius: 16px;
  font-weight: 600;
  margin-top: 16px;
  text-transform: capitalize;
}

.v-text-field {
  width: 100px;
}

.v-checkbox {
  display: flex;
  justify-content: center;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
