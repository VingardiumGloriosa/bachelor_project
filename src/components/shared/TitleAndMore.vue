// To do add a resable link based on where we want to route on the see all
<template>
  <v-container>
    <h1>{{ title }}</h1>
    <p class="more">See All</p>
  </v-container>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
});
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

.more {
  color: var(--primary) !important;
  font-weight: 600;
}
</style>
