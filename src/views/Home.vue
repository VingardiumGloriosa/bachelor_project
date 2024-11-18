<template>
  <div class="home-container">
    <HomeHighlight />
    <TitleAndMore title="Goal Progress" />
    <GoalProgress />
    <TitleAndMore title="Programmes" />
    <Programmes />
  </div>
</template>

<script setup>
import HomeHighlight from "@/components/home/HomeHighlight.vue";
import GoalProgress from "@/components/home/GoalProgress.vue";
import Programmes from "@/components/home/Programmes.vue";
import TitleAndMore from "@/components/shared/TitleAndMore.vue";
</script>

<style scoped></style>
