<template>
  <div class="program-list">
    <div id="filter-chips">
      <v-chip
        v-for="option in filterOptions"
        :key="option.value"
        :class="{ active: activeFilter === option.value }"
        @click="setFilter(option.value)"
        class="chip"
      >
        {{ option.label }}
      </v-chip>
    </div>

    <div id="programs">
      <ProgrammeCard
        v-for="program in filteredPrograms"
        :key="program.programme_id"
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
import { useUserStore } from "@/stores/UserStore";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { parseISO, isSameDay, isAfter, isBefore } from "date-fns";

const router = useRouter();
const activeFilter = ref("All");

const setFilter = (filter: string) => {
  activeFilter.value = filter;
};

const userStore = useUserStore();
const programmeStore = useProgrammeStore();

const filterOptions = ref([
  { label: "All", value: "All" },
  { label: "Today", value: "Today" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Past", value: "Past" },
]);

onMounted(async () => {
  await userStore.loadUser();
  if (userStore.user) {
    const userId = userStore.user.id;
    await programmeStore.loadProgrammes(userId);
  }
});

if (userStore.role === "Athlete") {
  filterOptions.value.push({ label: "Mine", value: "Mine" });
}

const filteredPrograms = computed(() => {
  const today = new Date();

  return programmeStore.programmes.filter((p) => {
    const programDate = p.name.match(/^\d{4}-\d{2}-\d{2}$/)
      ? parseISO(p.name)
      : null;

    switch (activeFilter.value) {
      case "Today":
        return programDate && isSameDay(programDate, today);
      case "Upcoming":
        return programDate && isAfter(programDate, today);
      case "Past":
        return programDate && isBefore(programDate, today);
      case "Mine":
        return p.programme_type === "personal";
      default:
        return true;
    }
  });
});

const goToProgrammeDetail = (programmeId: string, programmeTitle: string) => {
  router.push({
    name: "programme",
    params: { id: programmeId, title: programmeTitle },
  });
};
</script>
