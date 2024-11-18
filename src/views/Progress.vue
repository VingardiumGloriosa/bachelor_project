<template>
  <div class="home-container">
    <h1>Progress</h1>
    <V-select variant="underlined"> </V-select>
    <LiftCard />
    <HistoryList />
  </div>
</template>

<script setup lang="ts">
import LiftCard from "@/components/progress/LiftCard.vue";
import HistoryList from "@/components/progress/HistoryList.vue";
</script>

<style scoped></style>
