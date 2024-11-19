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
      <ProgrammeCard
        v-for="program in filteredPrograms"
        :key="program.id"
        :date="program.name"
        class="mb-4"
        @click="goToProgrammeDetail(program.programme_id, program.name)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import ProgrammeCard from "./ProgrammeCard.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useProgrammeStore } from "@/stores/programmeStore";

const router = useRouter();

const filterOptions = [
  "All",
  "Mine",
  "Today",
  "This Week",
  "This Month",
  "Next Month",
  "This Year",
];
const activeFilter = ref("All");

const setFilter = (filter: string) => {
  activeFilter.value = filter;
};

const userStore = useUserStore();
const programmeStore = useProgrammeStore();

onMounted(async () => {
  await userStore.loadUser();
  if (userStore.user) {
    const userId = userStore.user.id;
    await programmeStore.loadProgrammes(userId);
  }
});

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
      return programmeStore.programmes.filter(
        (p) => p.date === today.toISOString().split("T")[0]
      );
    case "This Week":
      return programmeStore.programmes.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= weekStart && programDate <= weekEnd;
      });
    case "This Month":
      return programmeStore.programmes.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= monthStart && programDate <= monthEnd;
      });
    case "Next Month":
      return programmeStore.programmes.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= nextMonthStart && programDate <= nextMonthEnd;
      });
    case "This Year":
      return programmeStore.programmes.filter((p) => {
        const programDate = new Date(p.date);
        return programDate >= yearStart && programDate <= yearEnd;
      });
    case "Personal Programmes":
      return programmeStore.programmes.filter((p) => isNaN(Number(p.name)));
    default:
      return programmeStore.programmes;
  }
});

const goToProgrammeDetail = (programmeId: string, programmeTitle: string) => {
  router.push({
    name: "programme",
    params: { id: programmeId, title: programmeTitle },
  });
};
</script>
