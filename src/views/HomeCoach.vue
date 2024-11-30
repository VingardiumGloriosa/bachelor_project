<template>
  <div class="home-container">
    <TitleAndMore title="Programmes" link="/programmes" />
    <ProgrammeList />
  </div>
</template>

<script setup lang="ts">
import ProgrammeList from "@/components/shared/ProgrammeList.vue";
import TitleAndMore from "@/components/shared/TitleAndMore.vue";
</script>

<style scoped></style>
