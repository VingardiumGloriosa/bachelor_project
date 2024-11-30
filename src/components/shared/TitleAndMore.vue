<template>
  <v-container>
    <h1>{{ title }}</h1>
    <router-link :to="link" class="more">See All</router-link>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
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
