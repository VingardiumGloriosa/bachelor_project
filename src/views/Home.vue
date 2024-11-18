<template>
  <div class="home-container">
    <HomeHighlight />
    <TitleAndMore title="Goal Progress" />
    <GoalProgress />
    <TitleAndMore title="Programmes" />
    <ProgrammeList />
  </div>
</template>

<script setup lang="ts">
import HomeHighlight from "@/components/home/HomeHighlight.vue";
import GoalProgress from "@/components/home/GoalProgress.vue";
import ProgrammeList from "@/components/shared/ProgrammeList.vue";
import TitleAndMore from "@/components/shared/TitleAndMore.vue";
</script>

<style scoped></style>
