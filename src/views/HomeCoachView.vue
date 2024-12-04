<template>
  <div class="home-container">
    <v-container>
      <h1>Programmes</h1>
      <v-btn class="btn-small" @click="makeNew()">+ Add</v-btn>
    </v-container>
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
h1 {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}
.v-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0%;
}
</style>
