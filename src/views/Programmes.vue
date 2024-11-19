<template>
  <div class="home-container">
    <div class="header-container">
      <h1>Programmes</h1>
      <v-btn class="btn-small" @click="makeNew()">+ Add</v-btn>
    </div>
    <ProgrammeList />
  </div>
</template>

<script setup lang="ts">
import ProgrammeList from "@/components/shared/ProgrammeList.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const makeNew = () => {
  router.push({
    name: "new-programme",
  });
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
