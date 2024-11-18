<template>
  <h1>{{ title }}</h1>
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
</style>
