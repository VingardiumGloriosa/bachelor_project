<template>
  <div class="program-list">
    <div id="filter-chips">
      <v-chip
        v-for="option in filterOptions"
        :key="option"
        :class="{ active: activeFilter === option }"
        @click="setFilter(option)"
        class="chip"
      >
        {{ option }}
      </v-chip>
    </div>

    <div id="programs">
      <Program
        v-for="program in filteredPrograms"
        :key="program.id"
        :date="program.date"
        class="mb-4"
      />
    </div>
  </div>
</template>

<script setup>
import Program from "./Program.vue";
import { ref, computed } from "vue";

const programs = [
  { id: 1, date: "2024-10-01" },
  { id: 2, date: new Date().toISOString().split("T")[0] },
  { id: 3, date: "2024-10-05" },
  { id: 4, date: "2024-11-01" },
  { id: 5, date: "2024-12-25" },
  { id: 6, date: "2024-01-01" },
];

const filterOptions = [
  "All",
  "Today",
  "This Week",
  "This Month",
  "Next Month",
  "This Year",
];
const activeFilter = ref("All");

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const filteredPrograms = computed(() => {
  const today = new Date();
  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date();
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const yearStart = new Date(today.getFullYear(), 0, 1);
  const yearEnd = new Date(today.getFullYear(), 11, 31);

  switch (activeFilter.value) {
    case "Today":
      return programs.filter(
        (p) => p.date === today.toISOString().split("T")[0]
      );
    case "This Week":
      return programs.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= weekStart && programDate <= weekEnd;
      });
    case "This Month":
      return programs.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= monthStart && programDate <= monthEnd;
      });
    case "Next Month":
      return programs.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= nextMonthStart && programDate <= nextMonthEnd;
      });
    case "This Year":
      return programs.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= yearStart && programDate <= yearEnd;
      });
    default:
      return programs;
  }
});
</script>
<style scoped>
#filter-chips {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 16px 0;
  white-space: nowrap;
  scroll-behavior: smooth;
}

.chip {
  flex: 0 0 auto;
  padding: 8px 16px;
  border: 1px solid #272640;
  color: #9b9bc2;
  background-color: var(--dark-grey) !important;
  border-radius: 16px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.chip.active {
  border: 1px solid var(--primary);
  color: var(--primary);
}

#filter-chips::-webkit-scrollbar {
  display: none;
}

#filter-chips {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
